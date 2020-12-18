# Overview

There are two main sections in this code base: the model training and the front end / simulation. These are discussed separately in more detail below, but all of the code for both of these is within this repository.

In addition, there is a section for getting the code locally on your machine, starting it up, and installing the requisite packages in order to make changes to it. Note that I am super happy to help out with any questions or walk you through it, and while I know the startup installation can be tedious, it is a lot easier with someone helping.

## Installation

### Command Line Interface

The majority of running and building this code is done through a command line interface (Terminal for Mac, Windows Powershell for Windows), otherwise referred to as CLI. A quick guide to Terminal's navigation can be found [here](https://www.digitalocean.com/community/tutorials/basic-linux-navigation-and-file-management), and one for Windows Powershell can be found [here](https://programminghistorian.org/en/lessons/intro-to-powershell).

### Git Installation

To start, we must first download the code base. The primary way (at least how I do it) of doing so is through SSH, where requires a slight bit of setup. 
1. Github account, which can be done [here](https://github.com/).
2. Installing git locally, the instructions for which can be found [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). 
3. Connecting git to SSH, instructions found [here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh).

Once this is done and all set up, we can begin by cloning the repo from the command line interface, in the folder that we want the repository to be copied to.

```
git clone git@github.com:banksfinn/membrane-simulation.git
```

We should now have all of the code locally. However, we still need to install some packages in order to run the code, which is split up into the model training and the front end/simulation.

### Brew/Choco

Another key to installing the requirements is a package manager, which exists solely on the command line.

If you have a Mac, Brew can be installed with the CLI command: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`. Then, `export PATH="/usr/local/opt/python/libexec/bin:$PATH"` should be run, so that the `python` command points to the correct version.

If you have a Windows computer, instructions for Choco can be found [here](https://chocolatey.org/install).

Once these have been installed, we can install the packages required to run this repository, all through the command line interface.

#### Packages

These command can be run by copy pasting the block of code below into the CLI, and pressing enter.

Mac:
```
brew install python
brew install node
pip install scipy
pip install numpy
pip install matplotlib
pip install argparse
```

Windows:
```
choco install python
choco install nodejs
pip install scipy
pip install numpy
pip install matplotlib
pip install argparse
```

These should be all of the packages needed to be installed for both the model training and the simulation to run, but I may have missed something.

## Model Training

All of the model training code exists within the `model_training` folder within this repository.

Once we have navigated our CLI to be within this folder, we can run the model_training on the example data by running the following command:
`python train_model.py --graph --file example-data.csv`

`train_model.py` takes in 3 input arguments: 
1. `--graph` is optional, and displays a graph of the trained model alongside the input data
2. `--file example-data.csv` is required, and should be followed by the filename of the CSV of the data. The easiest way to do this is to move the CSV into the `model_training` folder, then replace `example-date.csv` in the command with the name of the new file.
3. `--verbose` is an optional flag, and displays the heuristic data about the `least_squares` operation that was run. It can be placed anywhere after `train_model.py`, as long as it is not directly after `--file`

### Code Rundown

Model training is split into two segments: the general main function (`train_model.py`) and the actual calculations (`functions.py`).

`train_model.py` is fully commented, and each line of code should be fully described in the file.
`functions.py` is a little more complex, but is also heavily commented, and described in more detail below:

#### Functions.py
`get_data(file_name)` gets the data from the input CSV, taking in input data (TMP, flowrate) and output data (Flux), and returning it in a Python data structure (dictionary)

`model(param, x)` is the model of the whole equation. It takes in the parameters being trained upon (`param`) and the input data (`x`), and returns the result of that calculation.

`objective_function(param, x, y)` is the objective function, and returns the error of the model on certain data, which is simply the difference between the model's calculation (given a set of parameters) and the output data.

`jac(param, x, y)` contains information about the Jacobian, and creates a 2D array from the input data and the parameters, where each index is the Jacobian matrix for that given input data and that parameter.

`create_model(data, verbose)` takes in the data obtained in `get_data`, formats it to `least_squares` specifications, and runs the algorithm on it. Note that there is where one would change the initial parameters or guesses for (a, b, d) if one desired to. This returns the optimized values for a, b, and d (the parameters).

`generate_graph(data, results)` takes in the data and the resulting parameters from the model, organizes all of the data for ease of plotting, and plots it all on the same graph. This is where one would change up the format of the graph if desired, such as adding a title or retitling axis.

## Simulation

### NPM

NPM is a package manager for the front end we are using, and simplifies our deployment and running process tremendously. When in the base folder on the CLI, the following command should be run at the start: 
```npm install```
This will install all of the packages for the front end that are used in this project.

There are two ways to see the front end up and running. It can be ran locally (preferred for small changes, testing to see if things works), and then once verified, deployed on Github pages.

To start up the server locally, run: `npm start`, which will start up the server and redirect your browser to the site.

To deploy any changes to github pages, run `npm run deploy`. This will take a minute or so to reflect changes, but then then the [website](https://banksfinn.github.io/membrane-simulation/) should reflect your changes.


### Code Rundown

All of the relevant code (i.e. code that directly impacts the simulation rather than contributes to the running of the server) is found in `src/MembraneComponents.js`.

Once again, I will detail out each of the functions (defined by function functionName(parameters)) and what they contribute to the overall simulation.

`getFlux` takes in the parameters (set later on), the TMP, and the flow rate, and returns the value of that function. Note that any changes to the base function in `train_model` should be reflected here as well.

`stateToCSV` takes in all of the inputs that the user has changed, and writes their names and values to a string in comma delimited form to be put in the front of the final CSV file

`createCSV` takes in all of the data created in the simulation (discussed below), as well as the inputs from the function above, and writes it to a comma delimited string for CSV creation

The class `MembraneAPI` is the main component of our front end, and handles all inputs, simulation, and outputs. When it is created (when the webpage is visited), it runs the `constructor(props)` function, which establishes the initial values for a multitude of parameters. Here, one can set different parameters for initial values (in case the user doesn't fill out all of the input), change up the membrane details, change the "loss" functions for incorrect valve position, and most importantly, where the parameters derived from `train_model.py` should be input.

`handleCalculations` is the "brains" of the simulation, and is composed of 3 main parts. First, it populates the data arrays with the initial conditions set up by the user. Then, it iterates through each of the cycles of length `interval`, making a series of calculations that are fully defined in the comments. Finally, it returns all of these data arrays in a dictionary, which allows the `createCSV` file to generate the output.

`downloadCSVFile` does exactly what the name entails, and is run when the user clicks on the "submit" button. This is where `handleCalculations` is called, and consolidates all data into the CSV file and causes the browser to download it. 

`_onSelect`, `onPermValv`, `onFeedValv`, `onBufferValv` are all functions that bind the radio buttons / membrane selection to their correct values in `MembraneAPI`'s state, and don't really ever need to be changed.

`render()` is how the server creates the page, and is composed of HTML code to represent the components, along with some minor logic. Its basic structure can be gleamed from the indentation, and its important to note that each new indent implies that the more indented portions are children of the less indented portions. The easiest way to understand what is going on in terms of input is to dissect a singular input, and understand how it affects the process as a whole.
```
<TextField id="f_dex_conc"
           label="Dextran"
           onChange={()=>{this.state.f_dex_conc = parseFloat(document.getElementById('f_dex_conc').value)}}
           helperText="Feed Dextran Concentration (mol/L)"/>
```
Above is the input for the inital Dextran concentration in the feed, and has 4 components.  `label` refers to the text that is in the input before user input, and `helperText` is the text underneath the input. `id` is used to reference this specific element, and is used in `onChange`. `onChange` defines a function that is run whenever the value in the input is changed, and essentially sets the `state` of `MembraneAPI` to mirror the value that is currently within the input.

## Examples

I have found that the easiest way to understand how everything works together is to run through an example of a desired change within the code.

### Example 1: Creating a new input


Let's say that we want to add in a new input that represents a leak in the feed, which slowly drains the feed as the experiment progresses. The first step is to create the input for the user, which we will take to mean the "leak factor", or the percentage of feed that leaks every hour. We will put this next to the dropdown (as there is the most space for it), and create a new `TextField` component to allow the user to input this. In the current iteration of the code base, this goes on line 304, directly after the `Dropdown` component.
```
<TextField id="leak_factor" label="Leak Factor"
           onChange={()=>{this.state.leak_factor = parseFloat(document.getElementById('leak_factor').value)}}
           helperText="Feed % lost per Hour"/>
```

Now, we have to represent its change in the simulation. We want this to be calculated every iteration (as the leak is continuous), so a good place to put it is when we calculate the new feed mass of Dextran and RB within the loop, line 157 and 162 currently. Here are the lines before changing them:
```
feed_dex_mass.push(feed_dex_mass[feed_dex_mass.length - 1] - delta_dex_mass + buffer_dex_added);
...
feed_rb_mass.push(feed_rb_mass[feed_rb_mass.length - 1] - delta_rb_mass + buffer_rb_added);
```
We can see that this calculation is based off of the previous mass reading `feed_dex_mass[feed_dex_mass.length - 1]`, and then change in Dextran/RB is added and subtracted, from the permeate and buffer respectively.

We modify the code to take a percentage of the previous mass instead, to represent the leak and its leaking factor (% lost per hour).
```
let leak_factor = this.state.leak_factor // This can (and should) be done before the loop, to prevent it from being declared on every iteration
...
let leaked_dex = feed_dex_mass[feed_dex_mass.length - 1] * leak_factor * (this.state.interval / 60)
feed_dex_mass.push(feed_dex_mass[feed_dex_mass.length - 1] - delta_dex_mass + buffer_dex_added - leaked_dex);
...
let leaked_rb = feed_rb_mass[feed_rb_mass.length - 1] * leak_factor * (this.state.interval / 60)
feed_rb_mass.push(feed_rb_mass[feed_rb_mass.length - 1] - delta_rb_mass + buffer_rb_added - leaked_rb);
```
Now, our feed has a leak!

### Example 2: Changing up the model

Let's say that we had a sudden burst of inspiration, and we wanted to change the model behind the flux calculation. We want to maintain the fact that TMP and flow rate are the two independent variables, but have had a change of heart about the parameters.
```
F(a, b, d, tmp, flow) = (a * flow) / (tmp - b * flow) + d * flow
```
This is great, but we feel that the following relationship could better represent the flow:
```
F(a, b, d, e, tmp, flow) = (a * flow) / (tmp - b * flow) + a * d * flow + e
```
As this is a fundamental model change, we have to calculate the new optimal parameters using `train_model.py`, and use the function and new parameters in simulation's `getFlux`.

#### New Optimal Parameters
We will have to change `model`, `jac`, and `create_model` to reflect this change of heart.

In `model`, we have to change the function output to reflect our new equation, leading to:
```
def model(param, x):
  return (param[0] * x[1]) / (x[0] - x[1] * param[1]) + x[1] * param[2]
```
turns into:
```
def model(param, x):
  return (param[0] * x[1]) / (x[0] - x[1] * param[1]) + x[1] * param[2] * param[0] + param[3]
```

In `jac`, we have to rederive the Jacobian matrix with respect to each of the parameters, as seen below:
```
def jac(param, x, y):
    J = np.empty((len(x[0]), len(param)))
    # dF/da                                                                                                                                    
    J[:, 0] = x[1, :] / (x[0, :] - x[1, :] * param[1])
    # dF/db                                                                                                                                    
    J[:, 1] = (x[1, :]**2 * param[0]) / (x[0, :] - x[1, :] * param[1])**2
    # dF/dd                                                                                                                                    
    J[:, 2] = x[1, :]
    return J
```
turns into:
```
def jac(param, x, y):
    # We establish an empty 2D array (input size x num parameters)                                                                             
    J = np.empty((len(x[0]), len(param)))
    # dF/da                                                                                                                                    
    J[:, 0] = x[1, :] / (x[0, :] - x[1, :] * param[1]) + x[1, :] * param[2]
    # dF/db                                                                                                                                    
    J[:, 1] = (x[1, :]**2 * param[0]) / (x[0, :] - x[1, :] * param[1])**2
    # dF/dd                                                                                                                                    
    J[:, 2] = x[1, :] * param[0]
    # dF/de                                                                                                                                  
    J[:, 3] = 1
    return J
```

Finally, we want to change the initial guess within `create_model` to reflect the new parameters, and to put in a new value.
```
initial_guesses = np.array([0.01, -0.1, 0.01])
```
turns into:
```
initial_guesses = np.array([0.01, -0.1, 0.01, 0.01])
```

From this, after running it, we realize that this was a horrible decision, as tying the gain of the inverse function to its vertical offset simply results in horizontal lines. Despite this, we press on with the values achieved:
a = 0.02575323 
b = -1.53290494 
d = 1.24975394 
e = -4.54824055

#### Simulation Change
Now that we have the new parameter (a, b, d, e) values, we need to represent this change in the simulation. First, we want to change the function that calculates the value, `getFlux`, which is currently on line 10 in `MembraneComponents.js`
```
function getFlux(params, tmp, flowrate) {
    return (flowrate * params['a']) / (tmp - flowrate * params['b']) + flowrate * params['d']
}
```
turns into:
```
function getFlux(params, tmp, flowrate) {
    return (flowrate * params['a']) / (tmp - flowrate * params['b']) + flowrate * params['d'] * params['a'] + params['e']
}
```
Now, we have to reflect the new values that we generated using our model in the initial conditions of `MembraneAPI`, in the `this.modelParameters` dictionary.
```
this.modelParameters = {a: -0.002749688274522191, b: -8.301768508494198e-05, d: 0.03741113513434366};
```
turns into:
```
this.modelParameters = {a: 0.02575323, b: -1.53290494, d: 1.24975394, e: -4.54824055};
```

And voila! We have made this (questionable) change to the code base, and the model reflect our new equation.




