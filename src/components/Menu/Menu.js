import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import "./Menu.scss";
import { withRouter } from 'react-router-dom';
class Menu extends Component {

    constructor(props) {
        super(props);

        this.item = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',

                command: (e) => {
                    this.props.history.push('/')
                }
            },
            {
                label: 'Table',
                icon: 'pi pi-fw pi-table',
                command: (e) => {
                    this.props.history.push('/table');
                }
            },
            {
                label: 'Quit',
                icon: 'pi pi-fw pi-power-off'
            }
        ]
    }
    navigateToPage = (path) => {
        this.props.history.push(path);
    }
    render() {
        return (
            <div>
                <Menubar
                    model={this.item}
                />
            </div>
        );
    }
}

export default withRouter(Menu);