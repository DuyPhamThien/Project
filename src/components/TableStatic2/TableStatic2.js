
import React, { Component } from 'react';
import "../TableMe/TableMe.scss";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import moment from "moment";
import DialogSuccess from '../Table/DialogSuccess';
class TableStatic2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openDiaEdit: false,
            openDiaADD: false,
            openDiaDel: false,
            openDiaADDSuccess : false,
            openDiaADDFail : false,
            openDiaDelSuccess : false,
            openDiaDelFail : false,
            openDiaEditSuccess : false,
            openDiaEditFail : false,
            beginDate: "",
            endDate: "",
            name: "",
            projectCode: "",
            status: "",
            id: "",
            STT: "",
            first: 0,
            rows: 10,
            totalRow: 0,
            page: 1,
            filter: {},
            sortField: "ids",
            sortOrder: 1,
        }
        this.tableStruct = this.props.struct;

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
        if (this.tableStruct.rowStyle) {
            return this.tableStruct.rowStyle(rowid, data);
        } else {
            return {};
        }
    }

    createPaginator() {
        return <Paginator first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRow} onPageChange={(e) => this.onPageChange(e)}></Paginator>
    }

    createDiaADD() {
        if (this.tableStruct.add) {
            return (
                <Dialog header="them" visible={this.state.openDiaADD} onHide={() => this.onHide('openDiaADD')}>
                    <form onSubmit={(e) => this.handleADD(e)}>
                        {
                               Object.keys(this.tableStruct.add).map(colid => {
                                if (this.tableStruct.add[colid]['type'] == 'text') {
                                    return (
                                        <div className="Form" >
                                            <label>{colid}</label>
                                            <input type={this.tableStruct.add[colid]['type']} disabled={this.tableStruct.add[colid]['disable'] == 'true' ? 1 : 0} onChange={(e) => this.setState({ [colid]: e.target.value })} />
                                        </div>
                                    )
                                } else if (this.tableStruct.add[colid]['type'] == 'calendar') {
                                    return (
                                        <div className="Form">
                                            <label htmlFor="icon">{colid}</label>
                                            <Calendar id="icon"  onChange={(e) => this.setState({ [colid]: e.target.value })} showIcon />
                                        </div>
                                    )
                                }else if (this.tableStruct.add[colid]['type'] == 'check') {
                                    return (
                                        <div className="Form">
                                            <label htmlFor="icon">{colid}</label>
                                            <Checkbox className="checkbox" onChange={e => this.setState({ [colid]: e.checked })} checked={this.state[colid]}></Checkbox>
                                        </div>
                                    )
                                }

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

    createDiaEdit() {
        if (this.tableStruct.edit) {
            return (
                <Dialog header="Sua" visible={this.state.openDiaEdit} onHide={() => this.onHide('openDiaEdit')}>
                    <form onSubmit={(event) => this.handleEdit(event)}>
                        {
                            Object.keys(this.tableStruct.edit).map(colid => {
                                if (this.tableStruct.edit[colid]['type'] == 'text') {
                                    return (
                                        <div className="Form" >
                                            <label>{colid}</label>
                                            <input type={this.tableStruct.edit[colid]['type']} value={this.state[colid]} disabled={this.tableStruct.edit[colid]['disable'] == 'true' ? 1 : 0} onChange={(e) => this.setState({ [colid]: e.target.value })} />
                                        </div>
                                    )
                                } else if (this.tableStruct.add[colid]['type'] == 'calendar') {
                                    return (
                                        <div className="Form">
                                            <label htmlFor="icon">{colid}</label>
                                            <Calendar id="icon" value={  new Date(moment(this.state[colid]).format('llll')) }  onChange={(e) => this.setState({ [colid]: e.target.value })} showIcon />
                                        </div>
                                    )
                                }else if (this.tableStruct.add[colid]['type'] == 'check') {
                                    return (
                                        <div className="Form">
                                            <label htmlFor="icon">{colid}</label>
                                            <Checkbox className="checkbox" onChange={e => this.setState({ [colid]: e.checked })} checked={this.state[colid]}></Checkbox>
                                        </div>
                                    )
                                }
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
        this.onClick('openDiaADDSuccess');
        var add = {};
        Object.keys(this.tableStruct.add).map(item => {
            
                add[item] = this.state[item]
            
        })
        add['STT'] = this.state.data.length;
        var data = this.state.data;
        data.push(add);
        this.setState({ data: data });
        this.onHide('openDiaADD');

    }
    handleEdit(e) {
        e.preventDefault();
        this.onHide('openDiaEdit');
        this.onClick('openDiaEditSuccess');
        var save = {
            "STT": this.state.STT,
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "name": this.state.name,
            "projectCode": this.state.projectCode,
            "status": this.state.status
        }
        var data = this.state.data;
        var index = data.findIndex((item, index) => {
            return index == this.state.STT;
        })
        data[index] = save;
        this.setState({ data: data })

    }

    handleDelete(e) {
        e.preventDefault();
        this.onHide('openDiaDel');
        this.onClick('openDiaDelSuccess');
        var data = this.state.data;
        var index = data.findIndex((item, index) => {
            return index == this.state.STT;
        })
        data.splice(index, 1);
        this.setState({ data: data });

    }

    onPageChange(event) {
        const { first, rows } = event;
        this.setState({
            first: first,
            rows: rows
        });
        const page = (first / 10) + 1;
        this.tableStruct.events.filter([], page).then(res => {
            this.setState({ data: res.data.result, totalRow: res.data.size, page: page });
        })

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
    
    componentDidMount() {
        this.filter();
    }

    filter(data) {
        if (this.tableStruct.events && this.tableStruct.events.filter) {
            this.tableStruct.events.filter(data, this.state.page).then(res => {
                this.setState({ data: res.data.result, totalRow: res.data.size });
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

        var data = this.state.data;
        if (Object.keys(this.state.filter).length > 0) {
            Object.keys(this.state.filter).map(keys => {
                data = data.filter(data => {
                    return data[keys] == this.state.filter[keys].value;
                })
            })

            this.setState({ data: data });
        }
        else {
            this.tableStruct.events.filter(this.state.filter, this.state.page).then(res => {
                var data = res.data.result.map((item, index) => {
                    item.ids = index;
                    return item;
                })
                this.setState({ data: data, totalRow: res.data.size });
            })
        }

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
    onDefaultSort(colid) {
        var data = this.state.data;
        data.sort((a, b) => {
            var sortResult = a[colid] > b[colid] ? 1 : -1;
            return sortResult * this.state.sortOrder
        }
        )

        this.setState({ data: data });
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
                                            res => { this.onDefaultSort(colid) }
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
                                    return <th><input type='text' onBlur={e =>
                                        this.onFilter(colid, e.target.value)}
                                        placeholder={this.tableStruct.columns[colid].placeholder}
                                    ></input></th>

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
                <DialogSuccess titile="Them thanh cong" visible={this.state.openDiaADDSuccess} onHide={() => this.onHide('openDiaADDSuccess')} />
                <DialogSuccess titile="Them that bai" visible={this.state.openDiaADDFail} onHide={() => this.onHide('openDiaADDFail')} />
                <DialogSuccess titile="Xoa thanh cong" visible={this.state.openDiaDelSuccess} onHide={() => this.onHide('openDiaDelSuccess')} />
                <DialogSuccess titile="Xoa that bai" visible={this.state.openDiaDelFail} onHide={() => this.onHide('openDiaDelFail')} />
                <DialogSuccess titile="Sua thanh cong" visible={this.state.openDiaEditSuccess} onHide={() => this.onHide('openDiaEditSuccess')} />
                <DialogSuccess titile="Sua that bai" visible={this.state.openDiaEditFail} onHide={() => this.onHide('openDiaEditFail')} />
            </div>
        );
    }
}

export default TableStatic2;