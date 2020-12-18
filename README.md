# Overview

There are two main sections in this code base: the model training and the front end / simulation. These are discussed separately in more detail below, but all of the code for both of these is within this repository.

In addition, there is a section for getting the code locally on your machine, starting it up, and installing the requisite packages in order to make changes to it. Note that I am super happy to help out with any questions or walk you through it, and while I know the startup installation can be tedious, it is a lot easier with someone helping.

## Installation

### Command Line Interface

The majority of running and building this code is done through a command line interface (Terminal for Mac, Windows Powershell for Windows), otherwise referred to as CLI. A quick guide to Terminal's navigation can be found (https://www.digitalocean.com/community/tutorials/basic-linux-navigation-and-file-management)[here], and one for Windows Powershell can be found (https://programminghistorian.org/en/lessons/intro-to-powershell)[here].

### Git Installation

To start, we must first download the code base. The primary way (at least how I do it) of doing so is through SSH, where requires a slight bit of setup. 
1. Github account, which can be done (https://github.com/)[here].
2. Installing git locally, the instructions for which can be found (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)[here]. 
3. Connecting git to SSH, instructions found (https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)[here]

Once this is done and all set up, we can begin by cloning the repo from the command line interface, in the folder that we want the repository to be copied to.
```git@github.com:banksfinn/membrane-simulation.git```

We should now have all of the code locally. However, we still need to install some packages in order to run the code, which is split up into the model training and the front end/simulation.

### Brew/Choco

Another key to installing the requirements is a package manager, which exists solely on the command line.

If you have a Mac, Brew can be installed with the CLI command: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`. Then, `export PATH="/usr/local/opt/python/libexec/bin:$PATH"` should be run, so that the `python` command points to the correct version.

If you have a Windows computer, instructions for Choco can be found (https://chocolatey.org/install)[here].

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





