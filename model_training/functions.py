from scipy.optimize import least_squares
import numpy as np
import matplotlib.pyplot as plt
import csv
import numpy.ma as ma

# This is the general equation that we are modeling
def model(param, x):
    return (param[0] * x[1]) / (x[0] - x[1] * param[1]) + x[1] * param[2]

# This is the objective function that we want to be as close to 0 as possible
# Aka, we want the model - y to be 0
def fun(param, x, y):
    return model(param, x) - y

# This is the Jacobian of the above model, with partial derivatives taken with
# respect to the parameters
def jac(param, x, y):
    
    J = np.empty((len(x[0]), len(param)))
    for i in range(len(x[0])):
        # df/dparam1
        J[i, 0] = x[1, i] / (x[0, i] - x[1, i]*param[1])
        # df/dparam2
        J[i, 1] = (x[1, i]**2 * param[0]) / (x[0, i] - x[1, i] * param[1])**2
        # df/dparam3
        J[i, 2] = x[1, i]
    return J

# Create a model from the data input
def create_model(data, verbose):

    # We read in the data from the parameters, generated above in get_data
    y_data = np.array(data['y'], dtype=np.float)
    x_1_data = np.array(data['x_1'], dtype=np.float)
    x_2_data = np.array(data['x_2'], dtype=np.float)

    # We have to combine the multiple dependent variables into a single
    x_data = np.array([x_1_data, x_2_data])

    # These are our initial guesses for a, b, and c respectively
    initial_guesses = np.array([0.01, -0.1, 0.01])

    # If we have signified the verbose flag, we want to see the output of the analysis
    v = 1 if verbose else 0

    # Run our least_squares analysis
    res = least_squares(fun, initial_guesses, jac=jac, args=(x_data, y_data), verbose=v)

    # Return the 'x' values, which are the parameters it has learned
    return res.x

# Create a graph from the model created
def generate_graph(data, results):
    # Find unique flowrates in the data
    flowrates = list(set(data['x_2']))

    # We want a bounding x value
    max_tmp = float(max(data['x_1'])) * 1.5

    # We put it all in a dictionary
    for flowrate in flowrates:
        # Create a linspace of tmps, as well as a list of equal length of the one flowrate
        x_tmp_values = np.linspace(0, max_tmp, 50)
        x_flow_values = np.full((50), flowrate, dtype=np.float)
        y_data = model(results, np.array([x_tmp_values, x_flow_values]))

        plt.plot(x_tmp_values, y_data, 'o', markersize=2)

    # Just some annoying calculations to plot the original data together
    for flowrate in flowrates:
        x_1 = np.array(data['x_1'], dtype=np.float)
        x_2 = np.array(data['x_2'])
        y = np.array(data['y'], dtype=np.float)
        x_values = ma.masked_where(x_2 != flowrate, x_1)
        x_values = x_values[~x_values.mask]
        y_values = ma.masked_where(x_2 != flowrate, y)
        y_values = np.array(y_values[~y_values.mask])

        plt.plot(x_values, y_values)

    # Plot with the flowrates attached
    plt.legend(flowrates+flowrates)
    plt.show()

# Get the data from the CSV file
def get_data(file_name):
    with open(file_name) as f:
        csv_reader = csv.reader(f, delimiter=',')
        y = []
        x_1 = []
        x_2 = []
        next(csv_reader)
        for row in csv_reader:
            x_1.append(row[0])
            x_2.append(row[1])
            y.append(row[2])

        return {'y': y, 'x_1': x_1, 'x_2': x_2}
