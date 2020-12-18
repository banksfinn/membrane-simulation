# Here is where we import in packages that we want to use
import argparse
# from (file_name) import (function_names)
# here is where we import the actual functions that we use in this
from functions import get_data, generate_graph, create_model

# These 5 lines take in the command line arguments
parser = argparse.ArgumentParser(description='Retrain the model.')
parser.add_argument('--graph', default=False, action='store_true')
parser.add_argument('--filename', nargs=1, help='Data to train on (csv)')
parser.add_argument('--verbose', default=False, action='store_true', help='Show the metrics for the training (how well it did')
args = parser.parse_args()

# This makes sure that the filename of the inputted file is a CSV
if args.filename[0][-3:] != 'csv':
    print('The file needs to be in csv format. Please see the example data')
    exit(1)

# Get the data from the training file
data = get_data(args.filename[0])

# Create the file from the data
results = create_model(data, args.verbose)

# Output the new parameters
print('For the equation: (flowrate * a) / (tmp - flowrate * b) + flowrate * c')
print('a = {}'.format(results[0]))
print('b = {}'.format(results[1]))
print('c = {}'.format(results[2]))

# Graph the data, if requested
if args.graph:
    generate_graph(data, results)
    
