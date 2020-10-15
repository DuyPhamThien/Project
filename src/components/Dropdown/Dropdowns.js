import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';

class Dropdowns extends Component {
    render() {
        return (
            <div>
                 <Dropdown value={this.props.value} options={this.props.options} onChange={(e) => this.props.change(e)} className="p-mb-5" />
            </div>
        );
    }
}

export default Dropdowns;