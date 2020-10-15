import React, { Component } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Table2.scss';
import Dropdowns from '../Dropdown/Dropdowns';
import moment from "moment";
import DialogSuccess from '../Table/DialogSuccess';

class Table2 extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            data: [],
            openDiaADD: false,
            openDiaSave: false,
            openDiaDel: false,
            openDiaDelSuccess: false,
            openDiaAddSuccess: false,
            beginDate: "",
            endDate: "",
            name: "",
            code: "",
            status: "",
            id: "",
            position: 'center',
            globalFilter: '',
        })
    }
    componentDidMount() {
        axios.post(`https://sale-api.ecolandvn.com/demo/api/selling_phase/filter/${this.props.code}`, {
            "filters": [], "orders": [{ "asc": true, "key": "name" }]
        }).then(res => {
             var data = res.data.result.map((item, index) => {
                item.ids = index;
                return item;
            })
            //  this.setState({ data: res.data.result });
            this.setState({ data: data });
        }

        )

    }

    renderHeader() {
        return (
            <div className="table-header">
                <div className='p-d-flex p-flex-column'>
                    <span>Danh sach du an</span>
                </div>
                <div className="p-input-icon-left">
                    <i className="pi pi-search " />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                    <br />
                    <Button label="Add" icon="pi pi-plus" className="p-button-sm p-mr-3 Col_btnAdd p-button-raised p-button-text" style={{ width: '100px' }} onClick={() => this.onClick('openDiaADD')} />
                </div>
            </div>
        );
    }
    Col_btn(e, data) {
        return (
            <div>
                <Button label="Save" icon="pi pi-save" className="p-button-sm p-mr-3 p-button-raised p-button-text" onClick={() => this.openDiaSave(e, data)} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-raised p-button-text" onClick={() => this.openDiaDel(e, data)} />
            </div>
        )
    }
    Col_Checkbox(rowData) {
        return <Checkbox checked={rowData.status == true ? true : false}></Checkbox>
    }
    YesNo(name) {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={() => this.handleDelete()} autoFocus />
            </div>
        );
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
            code: '',
            status: '',
        });
    }
    openDiaSave(e, data) {
        this.setState({
            id: e.ids,
            beginDate: new Date(moment(e.beginDate).format('llll')),
            endDate: new Date(moment(e.endDate).format('llll')),
            name: e.name,
            code: e.projectCode,
            status: e.status,
        });
        this.onClick('openDiaSave');
    }
    openDiaDel(e, data) {
        this.setState({ id: e.ids });
        this.onClick('openDiaDel');
    }
    DropBoxChange(e) {
        this.setState({ code: e.value });
    }

    handleADD(event) {
        event.preventDefault();
        var add = {
            "ids" : this.state.data.length,
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "name": this.state.name,
            "projectCode": this.state.code,
            "status": this.state.status
        }
        var data1 = this.state.data;
        data1.push(add);
        this.setState({ data: data1 });
        this.onHide('openDiaADD');
        this.onClick('openDiaAddSuccess')
    }
    handleSave(event) {
        event.preventDefault();
        var save = {
            "ids": this.state.id,
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "name": this.state.name,
            "projectCode": this.state.code,
            "status": this.state.status
        }
        var data = this.state.data;
        var index = data.findIndex((item) => {
            return item.ids == this.state.id;
        })
        data[index] = save;
        this.setState({ data: data });
        this.onHide('openDiaSave');
    }
    handleDelete() {
        var data = this.state.data;
        var index = data.findIndex((item) => {
            return item.ids == this.state.id;
        })
        data.splice(index, 1);
        this.setState({ data: data });
        this.onHide('openDiaDel');
        this.onClick('openDiaDelSuccess');
    }
    render() {
        const header = this.renderHeader();
        return (
            <div className="datatable-doc-demo">
                <div className="card">
                    <DataTable value={this.state.data} header={header} rowHover className="p-datatable-customers" globalFilter={this.state.globalFilter}
                        paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[5, 10, 15]}
                    >
                        <Column field="ids" header="Code" sortable filter filterPlaceholder="Search by code"></Column>
                        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" ></Column>
                        <Column field="projectCode" header="Code" sortable ></Column>
                        <Column header="Status" body={this.Col_Checkbox} ></Column>
                        <Column body={(e, data) => this.Col_btn(e, data)}></Column>
                    </DataTable>



                    <Dialog header="Them" visible={this.state.openDiaADD} style={{ width: '50vw' }} onHide={() => this.onHide('openDiaADD')}>
                        <form onSubmit={(event) => this.handleADD(event)}>
                            <div className="Form">
                                <label htmlFor="icon">BeginDate</label>
                                <Calendar id="icon" value={this.state.beginDate} onChange={(e) => this.setState({ beginDate: e.value })} showIcon />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">EndDate</label>
                                <Calendar id="icon" value={this.state.endDate} onChange={(e) => this.setState({ endDate: e.value })} showIcon style={{ marginRight: '-1px' }} />
                            </div>
                            <div className="Form">
                                <span>Name</span>
                                <InputText onChange={(e) => this.setState({ name: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div >
                            <div className="Form">
                                <span>Code</span>
                                <Dropdowns value={this.state.code} options={this.props.option} change={(e) => this.DropBoxChange(e)} />
                            </div>
                            <div className="FormCheck">
                                <span>status</span>
                                <Checkbox className="checkbox" onChange={e => this.setState({ status: e.checked })} checked={this.state.status}></Checkbox>
                            </div>

                            <div className="FormButton">
                                <Button label="Submit" type="submit" className="p-button-sm " />
                            </div>
                        </form>
                    </Dialog>
                    <Dialog header="Sua" visible={this.state.openDiaSave} style={{ width: '50vw' }} onHide={() => this.onHide('openDiaSave')}>
                        <form onSubmit={(event) => this.handleSave(event)}>
                            <div className="Form">
                                <label htmlFor="icon">Id</label>
                                <InputText value={this.state.id} style={{ width: "236px", marginRight: '-21px' }} disabled />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">BeginDate</label>
                                <Calendar id="icon" value={this.state.beginDate} onChange={(e) => this.setState({ beginDate: e.value })} showIcon />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">EndDate</label>
                                <Calendar id="icon" value={this.state.endDate} onChange={(e) => this.setState({ endDate: e.value })} showIcon style={{ marginRight: '-1px' }} />
                            </div>
                            <div className="Form">
                                <span>Name</span>
                                <InputText value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div >
                            <div className="Form">
                                <span>Code</span>
                                <InputText value={this.state.code} onChange={(e) => this.setState({ code: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div>
                            <div className="FormCheck">
                                <span>status</span>
                                <Checkbox className="checkbox" onChange={e => this.setState({ status: e.checked })} checked={this.state.status}></Checkbox>
                            </div>

                            <div className="FormButton">
                                <Button label="Submit" type="submit" className="p-button-sm " />
                            </div>
                        </form>
                    </Dialog>
                    <DialogSuccess header="Confirm" footer={this.YesNo('openDiaDel')} titile="Ban chac chan muon xoa" visible={this.state.openDiaDel} onHide={() => this.onHide('openDiaDel')} />
                    <DialogSuccess titile="Xoa thanh cong" visible={this.state.openDiaDelSuccess} onHide={() => this.onHide('openDiaDelSuccess')} />
                    <DialogSuccess titile="Them thanh cong" visible={this.state.openDiaAddSuccess} onHide={() => this.onHide('openDiaAddSuccess')} />
                    {/* 
                    
                    
                    <DialogSuccess titile="Them that bai" visible={this.state.displayThatBai} onHide={() => this.onHide('displayThatBai')} />
                    <DialogSuccess titile="Xoa that bai" visible={this.state.displayXoaThatBai} onHide={() => this.onHide('displayXoaThatBai')} />
                    <DialogSuccess titile="Sua that bai" visible={this.state.displaySuaThatBai} onHide={() => this.onHide('displaySuaThatBai')} /> */}

                </div>
            </div>
        );
    }
}

export default Table2;