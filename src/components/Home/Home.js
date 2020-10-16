import React, { Component } from 'react';

import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import axios from 'axios';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import Dropdowns from '../Dropdown/Dropdowns';
import Head from '../Head/Head';
import Table from '../Table/Table';
import Table2 from '../Table2/Table2';
import Menu from '../Menu/Menu';
import TableMe from '../TableMe/TableMe';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import TableStatic from '../TableStatic/TableStatic';
import TableStatic2 from '../TableStatic2/TableStatic2';

class Home extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data ? this.props.data : {};
        this.state = {
            id: Number(Object.keys(data)[0] ? Object.keys(data)[0] : 0),
            data1: [],
        };
        this.tableStatic = {
            columns: {
                STT: {
                    'header': 'STT',
                    'func': (rowid, colid, data) => {
                        return rowid
                    },

                },
                name: {
                    'header': 'Name',
                    'filter': true,
                    'placeholder': "search by name",
                    'sort': true,
                    'style': () => ({ color: 'green' })
                },
                projectCode: {
                    'header': 'Code',
                    'sort': true
                },
                status: {
                    'header': 'status',
                    'filter': false,
                    'func': (rowid, colid, data) => {
                        return <Checkbox checked={data[rowid][colid] == true ? true : false}></Checkbox>
                    },
                    'sort': true
                },
                btn: {
                    'func': (rowid, colid, data) => {
                        return (
                            <div>
                                <Button label="Edit" icon="pi pi-save" className="p-button-sm p-mr-1 p-button-raised p-button-text"
                                    onClick={e => {
                                        var state = {};
                                        Object.keys(this.tableStatic.edit).map(item => {
                                            state[item] = data[rowid][item];
                                        });
                                        state['openDiaEdit'] = true;
                                        this.table.setState(state);
                                    }}
                                />
                                <Button label="Del" icon="pi pi-trash" className="p-button-sm p-mr-1 p-button-raised p-button-text" onClick={e => this.table.setState({
                                    openDiaDel: true, id: data[rowid].id
                                })} />
                            </div>
                        );

                    }
                }
            },
            rowStyle : (rowid,data)=>{
                if (data[rowid].id > 100) {
                    return { backgroundColor: '#f8f9fa' }
                }
            }
            ,
            events: {
                filter: async (filter, page, sort) => {
                    var filters = [];
                    for (const item in filter) {
                        filters.push({
                            "key": item,
                            "operation": "EQUALITY",
                            "operator": "and",
                            "value": filter[item].value
                        })
                    }
                    return axios.post(`https://sale-api.ecolandvn.com/demo/api/selling_phase/filter/E3/${page}/10`, {
                        "filters": filter ? filters : [],
                        "orders": sort ? [{
                            "asc": sort.sortOrder == 1 ? true : false,
                            "key": sort.sortField,
                        }] : [
                                {
                                    "asc": true,
                                    "key": "id"
                                }
                            ]
                    })
                 
                },
                add: (data, item) => {
                    var data1 = {};
                    Object.keys(item).map(item => {
                            data1[item] = data[item]


                    })
                    return axios.post('https://sale-api.ecolandvn.com/demo/api/selling_phase', data1)
                },
                put: (data, item) => {
                    var data1 = {};
                    Object.keys(item).map(item => {
                        if (item == "status") {
                            data1[item] = (String(data[item]) == "true" ? true : false)
                        }
                        else {
                            data1[item] = data[item]
                        }

                    })
                    return axios.put('https://sale-api.ecolandvn.com/demo/api/selling_phase', data1)
                },
                delete: (data) => {
                    return axios.delete(`https://sale-api.ecolandvn.com/demo/api/selling_phase/${data}`)
                }
            },
            edit: {
                id: {
                    type: "text",
                    disable : 'true'
                },
                beginDate: {
                    type: "calendar"
                },
                endDate: {
                    type: 'calendar'
                },
                name: {
                    type: 'text'
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'check'
                },
            },
            add: {
                beginDate: {
                    type: "calendar"
                },
                endDate: {
                    type: 'calendar'
                },
                name: {
                    type: 'text',
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'check'
                }
            },
        }


        this.tableStatic1 = {
            columns: {
                STT: {
                    'header': 'STT',
                    'func': (rowid, colid, data) => {
                        return rowid
                    },
                },
                name: {
                    'header': 'Name',
                    'filter': true,
                    'placeholder': "search by name",
                    'sort': true,
                    'style': () => ({ color: 'green' })
                },
                projectCode: {
                    'header': 'Code',
                    'sort': true
                },
                status: {
                    'header': 'status',
                    'filter': false,
                    'func': (rowid, colid, data) => {
                        return <Checkbox checked={data[rowid][colid] == true ? true : false}></Checkbox>
                    },
                    'sort': true
                },
                btn: {
                    'func': (rowid, colid, data) => {
                        return (
                            <div>
                                <Button label="Edit" icon="pi pi-save" className="p-button-sm p-mr-1 p-button-raised p-button-text"
                                    onClick={e => {
                                        var state = {};
                                        Object.keys(this.tableStatic1.edit).map(item => {
                                            state[item] = data[rowid][item];
                                        });
                                        state['openDiaEdit'] = true;
                                        state['STT'] = rowid;
                                        this.table.setState(state);
                                    }}
                                />
                                <Button label="Del" icon="pi pi-trash" className="p-button-sm p-mr-1 p-button-raised p-button-text" onClick={e => this.table.setState({
                                    openDiaDel: true, id: data[rowid].id
                                })} />
                            </div>
                        );

                    }
                }
            },
            rowStyle : (rowid,data)=>{
                if (rowid > 5) {
                    return { backgroundColor: '#f8f9fa' }
                }
            },
            events: {
                filter: (filter, page, sort) => {
                    var filters = [];
                    for (const item in filter) {
                        filters.push({
                            "key": item,
                            "operation": "EQUALITY",
                            "operator": "and",
                            "value": filter[item].value
                        })
                    }
                    return axios.post(`https://sale-api.ecolandvn.com/demo/api/selling_phase/filter/E3/${page}/10`, {
                        "filters": filter ? filters : [],
                        "orders": sort ? [{
                            "asc": sort.sortOrder == 1 ? true : false,
                            "key": sort.sortField,
                        }] : [
                                {
                                    "asc": true,
                                    "key": "id"
                                }
                            ]
                    })
                },
            },
            edit: {
                STT: {
                    type: "text"
                },
                beginDate: {
                    type: "calendar"
                },
                endDate: {
                    type: 'calendar'
                },
                name: {
                    type: 'text'
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'check'
                },
            },
            add: {
                beginDate: {
                    type: "calendar"
                },
                endDate: {
                    type: 'calendar'
                },
                name: {
                    type: 'text',
                    disable : 'true'
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'check'
                },
            },
        }

    };
    change(e) {
        this.setState({ id: e.value });
    }
    render() {
        var options = [];
        var options1 = [];
        Object.values(this.props.data).map(item => {
            options.push({
                label: item.name,
                value: Number(item.id)
            })
        })
        Object.values(this.props.data).map(item => {
            options1.push({
                label: item.code,
                value: item.code,
            })
        })
        var data = this.props.data[this.state.id] ? this.props.data[this.state.id] : '';
        return (
            <Router >
                <Menu />
                <div className="p-mx-auto" style={{ width: "80%" }}>
                    <Dropdowns value={this.state.id} options={options} change={(e) => this.change(e)} />
                    <Head data={data} />
                    <Switch>
                        <Route path="/" exact >
                            <Table key={data.code} code={data.code} option={options1} />
                        </Route>
                        <Route path="/table" exact component={(props) => <Table2  {...props} key={data.code} code={data.code} option={options1} />} />
                        <Route path="/me" exact >
                            <TableStatic ref={c => this.table = c} struct={this.tableStatic} />
                        </Route>
                        <Route path="/tableStatic1" exact >
                            <TableStatic2 ref={c => this.table = c} struct={this.tableStatic1} />
                        </Route>
                    </Switch>
                </div>
            </Router>


        );
    }
}

export default Home;