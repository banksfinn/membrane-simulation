from flask import Flask, request
from scipy.optimize import fsolve
import numpy as np

app = Flask(__name__)

@app.route('/rc_calc')
def get_calculations():
    a = request.args.get('a')
    b = request.args.get('b')
    d = request.args.get('d')
    def function1(r):
        z = r[0]
        c = r[1]

        F = np.empty((2))
        F[0] = d - a - z/(b - c)
        F[1] = z/(b-c)**2 - a/b
        return F

    zguess = np.array([1, 1])
    z, c = fsolve(function1, zguess)
    return {'z': z, 'c': c}

if __name__ == '__main__':
    app.run(debug=True)
