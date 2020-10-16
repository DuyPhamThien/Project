export default TableStructStatic = 
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
            'filter': true,
            'sort': true,
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
                            openDiaDel: true, id: data[rowid].ids
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