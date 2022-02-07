import React from 'react';

const AcceptedDefects = () => {



    return (
        <div>
            <table className="table ">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Date</th>
                    <th scope="col">Accepted</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Apple Airpods Pro</td>
                    <td>2</td>
                    <td>26.03.2021</td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="40" fill="green"
                             className="bi bi-check" viewBox="0 3 16 16">
                            <path
                                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                    </td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Xiaomi Mi Note 9 Chexol</td>
                    <td>1</td>
                    <td>13.03.2021</td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="40" fill="green"
                             className="bi bi-check" viewBox="0 3 16 16">
                            <path
                                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>                    </td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>iPhone naushnik</td>
                    <td>1</td>
                    <td>5.03.2021</td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="40" fill="green"
                             className="bi bi-check" viewBox="0 3 16 16">
                            <path
                                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AcceptedDefects;
