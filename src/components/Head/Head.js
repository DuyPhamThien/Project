import React, { Component } from 'react';

class Head extends Component {
    render() {
        var {data} = this.props;
        var img = data.gallery ? data.gallery : [];
        return (
            <div className="p-grid p-text-uppercase" >
                <div className="p-col-12 p-md-6 p-lg-6 ">
                    <div className="p-d-flex p-flex-column p-ai-center">
                        <p>Ten : {data.name}</p>
                        <p>Ma : {data.code}</p>
                        <p>Mo ta : {data.description}</p>
                        <p>Dia chi : {data.address}</p>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-lg-6">
                    <img src={img[0]} style={{ width: "350px", height: "200px" }} />
                </div>
            </div>
        );
    }
}

export default Head;