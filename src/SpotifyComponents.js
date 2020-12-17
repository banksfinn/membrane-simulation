import React from 'react';
import { Form } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function stateToCSV(state) {
    let string1 = "";
    let string2 = "";
    for (let key in state) {
        string1 += key + ',';
        string2 += state[key] + ',';
    }
    return string1.slice(0, -1) + '\n' + string2.slice(0, -1)
}

// THIS SHOULD BE THE SAME MODEL THAT WAS TRAINED UPON
function getFlux(params, tmp, flowrate) {
    return (flowrate * params['a']) / (tmp - flowrate * params['b']) + flowrate * params['c']
}

function createCSV(state, data) {
    let string = stateToCSV(state) + '\n\n';
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        string += keys[i] + ','
    }
    string = string.slice(0, string.length - 1) + '\n';
    for (let i = 0; i < data[keys[0]].length; i++){
        for (let j = 0; j < keys.length; j++) {
            string += data[keys[j]][i] + ','
        }
        string = string.slice(0, string.length - 1) + '\n';
    }
    return string
}

export class SpotifyAPI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'permeate_valve': true,
            'feed_valve': false,
            'buffer_valve': true,
            'p_init_mass': 100,
            'membrane_selected': '1'
        };
        // HERE IS WHERE DIFFERENT MEMBRANES ARE SET
        this.membrane = {
            '1': {'dex_rej': 0.92, 'rb_rej': 0.01, 'surface_area': 1},
            '2': {'dex_rej': 0.92, 'rb_rej': 0.1, 'surface_area': 1},
            '3': {'dex_rej': 0.65, 'rb_rej': 0.01, 'surface_area': 1}
        };
        this.valveConstants = {
            'buffer_closed_volume_percentage_loss_per_hour': 0.1,
            'feed_open_volume_percentage_loss_per_hour': 0.2,
            'permeate_closed_tmp_percentage_loss_per_hour': 0.3
        };

        this.molarMass = {
            'dex': 504.4,
            'rb': 479.02
        };

        // THESE ARE THE PARAMETERS OF THE MODEL
        this.modelParameters = {a: -0.002749688274522191, b: -8.301768508494198e-05, c: 0.03741113513434366};

        this.options = ['1', '2', '3'];
        this.default_option = this.options[0];
        this._onSelect = this._onSelect.bind(this);
        this.onPermValv = this.onPermValv.bind(this);
        this.onFeedValv = this.onFeedValv.bind(this);
        this.onBufferValv = this.onBufferValv.bind(this);
    }



    async handleCalculations(){
        let membrane = this.membrane[this.state.membrane_selected];

        // Conditions from Membrane
        let dex_rej = membrane['dex_rej'];
        let rb_rej = membrane['rb_rej'];
        let surface_area = membrane['surface_area'];

        let buffer_dex_conc = this.state.b_dex_conc;
        let buffer_rb_conc = this.state.b_rb_conc;

        // Permeate initial conditions
        let permeate_dex_mass = [this.state.p_dex_conc * this.state.p_init_mass / 1000 * this.molarMass['dex']]; // we do this b/c density is 1
        let permeate_dex_conc = [this.state.p_dex_conc];

        // Feed initial conditions
        let feed_dex_conc = [this.state.f_dex_conc];
        let feed_dex_mass = [this.state.f_dex_conc * this.state.f_init_mass / 1000 * this.molarMass['dex']]; // we do this b/c density is 1

        // Permeate initial conditions
        let permeate_rb_mass = [this.state.p_rb_conc * this.state.p_init_mass / 1000 * this.molarMass['rb']]; // we do this b/c density is 1
        let permeate_rb_conc = [this.state.p_rb_conc];

        // Feed initial conditions
        let feed_rb_conc = [this.state.f_rb_conc];
        let feed_rb_mass = [this.state.f_rb_conc * this.state.f_init_mass / 1000 * this.molarMass['rb']]; // we do this b/c density is 1

        // Initial volume of system (aka what is in the feed)
        let volume_system = this.state.f_init_mass;

        // Flow rate of the system
        let flow_rate = this.state.flow_rate;

        // Keep track of the flow rates and the intervals
        let flow_rates = [0];
        let time_array = [0];

        let total_perm_vol = 0;
        // Iterate through each interval, and make the calculations
        for (let i = this.state.interval; i < this.state.runtime/this.state.interval; i+=this.state.interval) {
            time_array.push(i);
            // Permeate flow is the flow rate out of the system (into the permeate) for a given interval
            // Let perm_flow be in mL (and assume the model is trained on that fact)
            let perm_flow = getFlux(this.modelParameters, this.state.tmp, this.state.flow_rate) * surface_area * this.state.interval;

            total_perm_vol += perm_flow;
            // We keep track of this
            flow_rates.push(perm_flow);
            // We now want to know the mass of dex leaving
            // Conc_out = Conc_orig * exp(-(1-R) * (perm_flow / flow_rate)
            // We then convert it to mass by multiplying it by the flowrate b/c density = 1
            let delta_dex_mass = feed_dex_conc[feed_dex_conc.length - 1] * Math.exp(-(1 - dex_rej) * (perm_flow / flow_rate)) * perm_flow / 1000 * this.molarMass['dex'];
            let delta_rb_mass = feed_rb_conc[feed_rb_conc.length - 1] * Math.exp(-(1 - rb_rej) * (perm_flow / flow_rate)) * perm_flow / 1000 * this.molarMass['rb'];

            // Perm flow out = buffer flow in
            let buffer_dex_added = perm_flow * buffer_dex_conc / 1000 * this.molarMass['dex'];
            let buffer_rb_added = perm_flow * buffer_rb_conc / 1000 * this.molarMass['rb'];
            // We now convert to mass to correctly remove it from the overall flow
            permeate_dex_conc.push((permeate_dex_mass[permeate_dex_mass.length - 1] + delta_dex_mass) / (total_perm_vol));
            permeate_rb_conc.push((permeate_rb_mass[permeate_rb_mass.length - 1] + delta_rb_mass) / (total_perm_vol));


            permeate_dex_mass.push(permeate_dex_mass[permeate_dex_mass.length - 1] + delta_dex_mass);
            permeate_rb_mass.push(permeate_rb_mass[permeate_rb_mass.length - 1] + delta_rb_mass);


            // We can simply remove the mass from the feed
            feed_dex_mass.push(feed_dex_mass[feed_dex_mass.length - 1] - delta_dex_mass + buffer_dex_added);
            // Since the volume of the system remains constant
            feed_dex_conc.push(feed_dex_mass[feed_dex_mass.length - 1] / volume_system);

            // We can simply remove the mass from the feed
            feed_rb_mass.push(feed_rb_mass[feed_rb_mass.length - 1] - delta_rb_mass + buffer_rb_added);
            // Since the volume of the system remains constant
            feed_rb_conc.push(feed_rb_mass[feed_rb_mass.length - 1] / volume_system);

            // If any of the valves are in the incorrect position, we want to lower volume of system / tmp
            if (!this.state.permeate_valve) {
                this.state.tmp = this.state.tmp - this.state.tmp * this.state.interval / 60 * this.valveConstants.permeate_closed_tmp_percentage_loss_per_hour;
            }
            if (this.state.feed_valve) {
                flow_rate = flow_rate - flow_rate * this.state.interval / 60 * this.valveConstants.feed_open_volume_percentage_loss_per_hour;
            }
            if (!this.state.buffer_valve) {
                flow_rate = flow_rate - flow_rate * this.state.interval / 60 * this.valveConstants.buffer_closed_volume_percentage_loss_per_hour;
            }
        }

        return {'time': time_array, 'permeate_dex_mass': permeate_dex_mass, 'permeate_dex_conc': permeate_dex_conc, 'flow_rates': flow_rates,
        'feed_dex_conc': feed_dex_conc, 'feed_dex_mass': feed_dex_mass, 'permeate_rb_mass': permeate_rb_mass, 'permeate_rb_conc': permeate_rb_conc,
            'feed_rb_conc': feed_rb_conc, 'feed_rb_mass': feed_rb_mass}
    }


    _onSelect (option) {
        this.setState({membrane_selected: option['value']});
    }

    onPermValv(event) {
        this.setState({permeate_valve: event.target.value === 'on'});
    }

    onFeedValv(event) {
        this.setState({feed_valve: event.target.value === 'on'});
    }

    onBufferValv(event) {
        this.setState({buffer_valve: event.target.value === 'on'});
    }

    async downloadTxtFile(e){
        e.preventDefault();
        let result = await this.handleCalculations();
        const element = document.createElement("a");
        const file = new Blob([createCSV(this.state, result)],
            {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "membrane_data.csv";
        document.body.appendChild(element);
        element.click();
        return false;
    };

    async get_flow(flowrate, tmp, interval){
        let result = 0;
        await fetch(`/rc_flow?flowrate=${flowrate}&tmp=${tmp}&interval=${interval}`).then(res => res.json()).then(function(output) {
            result = output['flow'];
        });
        return result
    };

    render() {
        return (
            <div>
                <Form>
                    <div>
                        <h5 className="intro_header">Operating Parameters</h5>
                        <TextField id="flow_rate" label="Volumetric Flow Rate"
                                   onChange={()=>{this.state.flow_rate = parseFloat(document.getElementById('flow_rate').value)}}
                                    helperText="Volumetric Flow Rate of Recirculation (mL/min)"/>
                        <TextField id="tmp" label="TMP"
                                   onChange={()=>{this.state.tmp = parseFloat(document.getElementById('tmp').value)}}
                                   helperText="Transmembrane Pressure (atm)"/>
                        <TextField id="runtime" label="Runtime"
                                   onChange={()=>{this.state.runtime = parseInt(document.getElementById('runtime').value)}}
                                   helperText="Experimental Runtime (minutes)"/>
                        <TextField id="interval" label="Intervals"
                                   onChange={()=>{this.state.interval = parseFloat(document.getElementById('interval').value)}}
                                   helperText="Length of Interval (minutes)"/>
                    </div>
                    <div>
                        <h5 className="intro_header">Permeate Reservoir</h5>
                        <div className="radio-div">
                            <div>Valve</div>
                            <div onChange={this.onPermValv}>
                                <input type="radio" value='on' name='perm_valv'/> Open '
                                <input type="radio" value='off' name='perm_valv'/> Closed
                            </div>
                        </div>
                        <TextField id="p_init_mass" label="Mass"
                                   onChange={()=>{this.state.p_init_mass = parseFloat(document.getElementById('p_init_mass').value)}}
                                   helperText="Permeate Initial Mass (g)"/>
                        <TextField id="p_rb_conc" label="RB"
                                   onChange={()=>{this.state.p_rb_conc = parseFloat(document.getElementById('p_rb_conc').value)}}
                                   helperText="Permeate RB Concentration (mol/L)"/>
                        <TextField id="p_dex_conc" label="Dextran"
                                   onChange={()=>{this.state.p_dex_conc = parseFloat(document.getElementById('p_dex_conc').value)}}
                                   helperText="Permeate Dextran Concentration (mol/L)"/>
                        {/*<TextField id="p_dex_fitc_conc" label="Dextran-FITC"*/}
                        {/*           onChange={()=>{this.state.p_dex_fitc_conc = parseFloat(document.getElementById('p_dex_fitc_conc').value)}}*/}
                        {/*           helperText="Permeate Dextran-FITC Concentration (mol/L)"/>*/}

                    </div>
                    <div>
                        <h5 className="intro_header">Feed Reservoir</h5>
                        <div className="radio-div">
                            <div>Valve</div>
                            <div onChange={this.onFeedValv}>
                                <input type="radio" value='on' name='feed_valv'/> Open '
                                <input type="radio" value='off' name='feed_valv'/> Closed
                            </div>
                        </div>
                        <TextField id="f_init_mass" label="Mass"
                                   onChange={()=>{this.state.f_init_mass = parseFloat(document.getElementById('f_init_mass').value)}}
                                   helperText="Feed Initial Mass (g)"/>
                        <TextField id="f_rb_conc" label="RB"
                                   onChange={()=>{this.state.f_rb_conc = parseFloat(document.getElementById('f_rb_conc').value)}}
                                   helperText="Feed RB Concentration (mol/L)"/>
                        <TextField id="f_dex_conc" label="Dextran"
                                   onChange={()=>{this.state.f_dex_conc = parseFloat(document.getElementById('f_dex_conc').value)}}
                                   helperText="Feed Dextran Concentration (mol/L)"/>
                        {/*<TextField id="f_dex_fitc_conc" label="Dextran-FITC"*/}
                        {/*           onChange={()=>{this.state.f_dex_fitc_conc = parseFloat(document.getElementById('f_dex_fitc_conc').value)}}*/}
                        {/*           helperText="Feed Dextran-FITC Concentration (mol/L)"/>*/}

                    </div>
                    <div>
                        <h5 className="intro_header">Buffer Reservoir</h5>
                        <div className="radio-div">
                            <div>Valve</div>
                            <div onChange={this.onBufferValv}>
                                <input type="radio" value='on' name='buffer_valv'/> Open '
                                <input type="radio" value='off' name='buffer_valv'/> Closed
                            </div>
                        </div>
                        <TextField id="b_init_mass" label="Mass"
                                   onChange={()=>{this.state.b_init_mass = parseFloat(document.getElementById('b_init_mass').value)}}
                                   helperText="Buffer Initial Mass (g)"/>
                        <TextField id="b_rb_conc" label="RB"
                                   onChange={()=>{this.state.b_rb_conc = parseFloat(document.getElementById('b_rb_conc').value)}}
                                   helperText="Buffer RB Concentration (mol/L)"/>
                        <TextField id="b_dex_conc" label="Dextran"
                                   onChange={()=>{this.state.b_dex_conc = parseFloat(document.getElementById('b_dex_conc').value)}}
                                   helperText="Buffer Dextran Concentration (mol/L)"/>
                        {/*<TextField id="b_dex_fitc_conc" label="Dextran-FITC"*/}
                        {/*           onChange={()=>{this.state.b_dex_fitc_conc = parseFloat(document.getElementById('b_dex_fitc_conc').value)}}*/}
                        {/*           helperText="Buffer Dextran-FITC Concentration (mol/L)"/>*/}

                    </div>
                    <div>
                        <h5 className="intro_header">Membrane Selection</h5>
                        <Dropdown className='dropdown' options={this.options} onChange={this._onSelect} value={this.default_option}/>
                    </div>
                    <button className='submit' onClick={this.downloadTxtFile.bind(this)}>Download</button>

                </Form>
            </div>
        )
    }
}


