import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
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
class Home extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data ? this.props.data : {};
        this.state = {
            id: Number(Object.keys(data)[0] ? Object.keys(data)[0] : 0),
            data1: [],
        };
        // if(this.state.id !== 0){
        //     this.post(this.props.data[this.state.id].code).then(res => this.setState({data1 : res.data}));
        // }

        this.tableStruct = {
            columns: {
                name: {
                    'header': 'Name',
                    'filter': true,
                    'style': (rowid, colid, data) => {
                        return { color: 'red' }
                    }
                },
                id: {
                    'header': 'id',
                    'filter': true,
                },
                thietlap: {
                    'header': 'setting',
                    'func': (rowid, colid, data) => {
                        return <button onClick={e => console.log(data[rowid])}>test</button>;
                    }
                },
            },
            events: {
                filter: (value) => {
                    console.log(value)
                    return [{ name: 'ok', id: 1 }, { name: 'ok1', id: 2 }]
                },


            },
        }

        this.tableStruct1 = {
            columns: {
                ids: {
                    'header': 'STT',
                    'func': (rowid, colid, data) => {
                        if (data[rowid][colid] == 21) {
                            return <b>21</b>
                        } else {
                            return data[rowid][colid]
                        }
                    },
                    'style': (rowid, colid, data) => {
                        return { color: 'red' }
                    },
                    'sort': true,
                    'filter': true,
                    'placeholder': "search by id",
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
                        // if (data[rowid][colid]) {
                        //     return <input type="checkbox" checked readOnly></input>;
                        // }
                        // return <input type="checkbox" readOnly ></input>;
                        return <Checkbox checked={data[rowid][colid] == true ? true : false}></Checkbox>
                    },
                    'sort': true
                },
                btn: {
                    'func': (rowid, colid, data) => {
                        return (
                            <div>
                                {/* neu muon dung bang 2 thi id: data[rowid].ids */}
                                <Button label="Edit" icon="pi pi-save" className="p-button-sm p-mr-3 p-button-raised p-button-text"
                                    onClick={e => {
                                        var state = {};
                                        Object.keys(this.tableStruct1.edit).map(item => {
                                            state[item] = data[rowid][item];
                                        });
                                        state['openDiaEdit'] = true;
                                        // state['id'] = data[rowid].ids;
                                        this.table.setState(state);
                                    }}
                                />
                                <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-raised p-button-text" onClick={e => this.table.setState({
                                    openDiaDel: true, id: data[rowid].id
                                })} />
                            </div>
                        );

                    }
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
                add: (data, item) => {
                    var data1 = {};
                    Object.keys(item).map(item => {
                        if (item == "status") {
                            data1[item] = (data[item] == "true" ? true : false)
                        }
                        else {
                            data1[item] = data[item]
                        }

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
                    type: "text"
                },
                beginDate: {
                    type: "text"
                },
                endDate: {
                    type: 'text'
                },
                name: {
                    type: 'text'
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'text'
                },
            },
            add: {
                beginDate: {
                    type: "text"
                },
                endDate: {
                    type: 'text'
                },
                name: {
                    type: 'text'
                },
                projectCode: {
                    type: 'text'
                },
                status: {
                    type: 'text'
                }
            },
        }

    };
    ok() {

    }
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
                <Link to="/table">Home</Link>
                <div className="p-mx-auto" style={{ width: "80%" }}>
                    <Dropdowns value={this.state.id} options={options} change={(e) => this.change(e)} />
                    <Head data={data} />
                    <Switch>
                        <Route path="/" exact >
                            <Table key={data.code} code={data.code} option={options1} />
                        </Route>
                        <Route path="/table" exact component={(props) => <Table2  {...props} key={data.code} code={data.code} option={options1} />} />
                        <Route path="/me" exact >
                            {/* <TableMe struct={this.tableStruct} data={this.tableData} /> */}

                            <TableMe ref={c => this.table = c} struct={this.tableStruct1} />
                        </Route>
                    </Switch>
                </div>
            </Router>


        );
    }
}

export default Home;