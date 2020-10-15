import React, { Component } from 'react';
import "./TableMe.scss";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import DialogSuccess from '../Table/DialogSuccess';
class TableMe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openDiaEdit: false,
            openDiaADD: false,
            openDiaDel: false,
            sortOrder: 0,
            sortField: '',
            beginDate: "",
            endDate: "",
            name: "",
            projectCode: "",
            status: "",
            id: "",
            first: 0,
            rows: 10,
            totalRow: 0,
            page: 1,
            filter: {},
            sortField: "id",
            sortOrder: 1,
        }
        this.tableStruct = this.props.struct;


    }
    onClick(name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }
    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
        this.setState({
            beginDate: '',
            endDate: '',
            name: '',
            projectCode: '',
            status: '',
        });
    }
    YesNo(name) {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={(e) => this.handleDelete(e)} autoFocus />
            </div>
        );
    }
    createData(rowid, colid, data) {
        if (this.tableStruct.columns[colid]['func']) {
            return this.tableStruct.columns[colid]['func'](rowid, colid, data);
        } else {
            return data[rowid][colid];
        }
    }
    getColumnStyle(rowid, colid, data) {
        if (this.tableStruct.columns[colid]['style']) {
            return this.tableStruct.columns[colid]['style'](rowid, colid, data);
        } else {
            return {};
        }
    }
    getRowStyle(rowid, data) {
        if (data[rowid].id > 100) {
            return { backgroundColor: '#f8f9fa' }
        }
    }
    createDiaEdit() {
        if (this.tableStruct.edit) {
            return (
                <Dialog header="Sua" visible={this.state.openDiaEdit} onHide={() => this.onHide('openDiaEdit')}>
                    <form onSubmit={(event) => this.handleEdit(event)}>
                        {
                            Object.keys(this.tableStruct.edit).map(colid => {
                                return (
                                    <div className="Form">
                                        <label>{colid}</label>
                                        <input type={this.tableStruct.edit[colid]['type']} value={this.state[colid]} onChange={(e) => this.setState({ [colid]: e.target.value })} />
                                    </div>
                                )
                            })
                        }
                        <div className="FormButton">
                            <Button label="Submit" type="submit" className="p-button-sm " />
                        </div>
                    </form>
                </Dialog>
            )
        }
    }
    handleADD(e) {
        e.preventDefault();
        this.onHide('openDiaADD');
        if (this.tableStruct.events && this.tableStruct.events.add) {
            this.tableStruct.events.add(this.state, this.tableStruct.add).then(res => this.tableStruct.events.filter([], this.state.page).then(res => {
                var data = res.data.result.map((item, index) => {
                    item.ids = index;
                    return item;
                })
                this.setState({ data: data, totalRow: res.data.size });
            }))
        } else {
            this.onDefaultAdd();
        }

    }
    handleEdit(e) {
        e.preventDefault();
        this.onHide('openDiaEdit');
        if (this.tableStruct.events && this.tableStruct.events.put) {
            this.tableStruct.events.put(this.state, this.tableStruct.edit).then(res => this.tableStruct.events.filter([], this.state.page).then(res => {
                var data = res.data.result.map((item, index) => {
                    item.ids = index;
                    return item;
                })
                this.setState({ data: data});
            }))
        } else {
            this.onDefaultEdit();
        }

    }
    handleDelete(e) {
        e.preventDefault();
        this.onHide('openDiaDel');
        if (this.tableStruct.events && this.tableStruct.events.delete) {
            this.tableStruct.events.delete(this.state.id).then(res => this.tableStruct.events.filter([], this.state.page).then(res => {
                var data = res.data.result.map((item, index) => {
                    item.ids = index;
                    return item;
                })
                this.setState({ data: data });
            }))
        } else {
            this.onDefaultDel();
        }

    }
    createDiaADD() {
        if (this.tableStruct.add) {
            return (
                <Dialog header="them" visible={this.state.openDiaADD} onHide={() => this.onHide('openDiaADD')}>
                    <form onSubmit={(e) => this.handleADD(e)}>
                        {
                            Object.keys(this.tableStruct.add).map(colid => {
                                return (
                                    <div className="Form">
                                        <label>{colid}</label>
                                        <input type={this.tableStruct.add[colid]['type']} onChange={(e) => this.setState({ [colid]: e.target.value })} />
                                    </div>
                                )
                            })
                        }
                        <div className="FormButton">
                            <Button label="Submit" type="submit" className="p-button-sm " />
                        </div>
                    </form>
                </Dialog>
            )
        }
    }
    onPageChange(event) {
        const { first, rows } = event;
        this.setState({
            first: first,
            rows: rows
        });
        const page = (first / 10) + 1;
        this.tableStruct.events.filter([], page).then(res => {
            var data = res.data.result.map((item, index) => {
                item.ids = index;
                return item;
            })
            this.setState({ data: data, totalRow: res.data.size, page: page });
        })

    }
    createPaginator() {
        return <Paginator first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRow} onPageChange={(e) => this.onPageChange(e)}></Paginator>
    }
    componentDidMount() {
        this.filter();
    }

    filter(data) {
        if (this.tableStruct.events && this.tableStruct.events.filter) {
            this.tableStruct.events.filter(data, this.state.page).then(res => {
                var data = res.data.result.map((item, index) => {
                    item.ids = index;
                    return item;
                })
                // this.setState({ data: res.data.result, totalRow: res.data.size });
                this.setState({ data: data, totalRow: res.data.size });
            })
        }
    }

    onFilter(colid, value) {
        this.state.filter[colid] = { value };
        Object.keys(this.state.filter).map(item => {
            if (this.state.filter[item].value == "") {
                delete this.state.filter[item];
            }
        })
        this.tableStruct.events.filter(this.state.filter, this.state.page).then(res => {
            this.setState({ data: res.data.result, totalRow: res.data.size });
        })

    }

    onSort(colid) {
        return new Promise((res, rej) => {
            if (this.state.sortField == colid) {
                res(this.setState({ sortOrder: -(this.state.sortOrder) }))
            }
            else {
                res(this.setState({ sortField: colid, sortOrder: 1 }))
            }
        })
    }
    geticon(colid) {
        if (this.state.sortField != colid) {
            return "pi pi-fw pi-sort-alt";
        }
        else if (this.state.sortField == colid && this.state.sortOrder == 1) {
            return "pi pi-fw pi-sort-amount-up-alt";
        }
        else if (this.state.sortField == colid && this.state.sortOrder == -1) {
            return "pi pi-fw pi-sort-amount-down"
        }
    }
    onDefaultAdd() {
        var add = {};
        Object.keys(this.tableStruct.add).map(item => {
            if (item == "status") {
                add[item] = (this.state[item] == "true" ? true : false)
            }
            else {
                add[item] = this.state[item]
            }

        })
        add['ids'] = this.state.data.length; 
        var data = this.state.data;
        data.push(add);
        this.setState({ data: data });
        this.onHide('openDiaADD');
    }
    onDefaultEdit() {
        var save = {
            "ids": this.state.id,
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "name": this.state.name,
            "projectCode": this.state.projectCode,
            "status": this.state.status
        }
        var data = this.state.data;
        var index = data.findIndex((item) => {
            return item.ids == this.state.id;
        })
        data[index] = save;
        this.setState({ data: data });
    }
    onDefaultDel() {
        var data = this.state.data;
        var index = data.findIndex((item) => {
            return item.ids == this.state.id;
        })
        data.splice(index, 1);
        this.setState({ data: data });

    }
    render() {
        return (
            <div>
                <Button label="Add" icon="pi pi-plus" className="p-button btn p-component p-button-sm p-mr-3 btnAdd p-button-raised p-button-text" onClick={e => this.setState({ openDiaADD: true })} />
                <table className="me-datatable" >
                    <thead className="me-datatable-thead" >
                        <tr>
                            {Object.keys(this.tableStruct.columns).map(colid => {
                                if (this.tableStruct.columns[colid].sort) {
                                    return <th className={this.state.sortField == colid ? "hightlight" : ""}>
                                        <span  >{this.tableStruct.columns[colid].header}</span>
                                        <span className={this.geticon(colid)} onClick={e => this.onSort(colid).then(
                                            res => {
                                                this.tableStruct.events.filter(this.state.filter, this.state.page, { sortField: this.state.sortField, sortOrder: this.state.sortOrder }).then(res => {
                                                    this.setState({ data: res.data.result, totalRow: res.data.size });
                                                })
                                            }
                                        )} ></span>
                                    </th>
                                }
                                else {
                                    return <th>{this.tableStruct.columns[colid].header}</th>
                                }
                            }

                            )}
                        </tr>
                        <tr>
                            {Object.keys(this.tableStruct.columns).map(colid => {
                                if (this.tableStruct.columns[colid].filter) {
                                    return <th><input type='text' onBlur={e => this.onFilter(colid, e.target.value)} placeholder={this.tableStruct.columns[colid].placeholder} ></input></th>

                                }
                                else {
                                    return <th></th>
                                }
                            }

                            )}
                        </tr>
                    </thead>
                    <tbody className="me-datatable-tbody">
                        {this.state.data && this.state.data.map((item, rowid) => (
                            <tr className="me-datatable-row" style={this.getRowStyle(rowid, this.state.data)} >
                                {Object.keys(this.tableStruct.columns).map(colid => {
                                    return <td style={this.getColumnStyle(rowid, colid, this.data)}> {this.createData(rowid, colid, this.state.data)} </td>
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>
                {this.createDiaEdit()}
                {this.createDiaADD()}
                {this.createPaginator()}
                <DialogSuccess header="Confirm" footer={this.YesNo('openDiaDel')} titile="Ban chac chan muon xoa" visible={this.state.openDiaDel} onHide={() => this.onHide('openDiaDel')} />
            </div>
        );
    }
}

export default TableMe;