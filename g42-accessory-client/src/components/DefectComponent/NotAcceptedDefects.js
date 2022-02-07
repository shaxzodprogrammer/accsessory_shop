import React, {Component} from 'react';

class NotAcceptedDefects extends Component {
    render() {
        return (
            <div>
                <table className="table ">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Chexol Iphone5</td>
                        <td>2</td>
                        <td>28.04.2021</td>
                        <td>
                            <button className="btn btn-info">edit</button>
                            <button className="btn btn-danger ml-3">delete</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Naushnik RedMi</td>
                        <td>1</td>
                        <td>20.04.2021</td>
                        <td>
                            <button className="btn btn-info ">edit</button>
                            <button className="btn btn-danger ml-3">delete</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Zaryadnik J6</td>
                        <td>1</td>
                        <td>15.04.2021</td>
                        <td>
                            <button className="btn btn-info">edit</button>
                            <button className="btn btn-danger ml-3">delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default NotAcceptedDefects;