import React, {useState} from "react";
import {ROLE, TOKEN} from "../utills/constants";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";


function Navbar({role,history,tab}){
    const logout=()=>{
        localStorage.removeItem(TOKEN)
        localStorage.removeItem(ROLE)
        history.push('/')
    }
    return(
        <div className="navbar nav">
            {role==='ROLE_DIRECTOR'?
            <ul className="list-unstyled">
                {/*<li className="nav-item">*/}
                {/*    <Link to="/mainPage">*/}
                {/*        Director Main*/}
                {/*    </Link>*/}
                {/*</li>*/}
                <li className="nav-item">
                    <Link to="/mainPage">
                        <button className={tab==='1'?"btn navButton":"btn navBarButton"}>
                            Asosiy sahifa
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/report">
                        <button className={tab==='2'?"btn navButton":"btn navBarButton"}>
                            Hisobotlar
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/warehouse">
                        <button className={tab==='3'?"btn navButton":"btn navBarButton"}>
                            Ombor
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/sellerReject">
                        <button className={tab==='4'?"btn navButton":"btn navBarButton"}>
                            Qaytgan Mollar
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/sellerDefect">
                        <button className={tab==='5'?"btn navButton":"btn navBarButton"}>
                            Defect
                        </button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/catalog">
                        <button className={tab==='6'?"btn navButton":"btn navBarButton"}>
                            Catalog
                        </button>
                    </Link>
                </li>
                <li className="nav-item" onClick={logout}>
                    <Link to="/">
                        <button className={tab==='7'?"btn navButton":"btn navBarButton"}>
                            Chiqish
                        </button>
                    </Link>
                </li>
                {/*<li className="nav-item"><button type="button" className="btn btn-outline-dark border-0" onClick={logout}>Chiqish</button></li>*/}
            </ul>

                :role==='ROLE_MANAGER'?
                    <ul className="list-unstyled">
                        <li className="nav-item">
                            <Link to="/mainPage">
                                <button className={tab==='1'?"btn navButton":"btn navBarButton"}>
                                    Asosiy sahifa
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/report">
                                <button className={tab==='2'?"btn navButton":"btn navBarButton"}>
                                    Hisobotlar
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/warehouse">
                                <button className={tab==='3'?"btn navButton":"btn navBarButton"}>
                                    Ombor
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sellerReject">
                                <button className={tab==='4'?"btn navButton":"btn navBarButton"}>
                                    Qaytgan Mollar
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sellerDefect">
                                <button className={tab==='5'?"btn navButton":"btn navBarButton"}>
                                    Defect
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/catalog">
                                <button className={tab==='6'?"btn navButton":"btn navBarButton"}>
                                    Catalog
                                </button>
                            </Link>
                        </li>
                        <li className="nav-item" onClick={logout}>
                            <Link to="/">
                                <button className={tab==='7'?"btn navButton":"btn navBarButton"}>
                                    Chiqish
                                </button>
                            </Link>
                        </li>
                        {/*<li className="nav-item"><button type="button" className="btn btn-outline-dark border-0" onClick={logout}>Chiqish</button></li>*/}
                    </ul>
                    :role==='ROLE_SELLER'?
                        <ul className="list-unstyled">
                            <li className="nav-item">
                                <Link to="/sellerSale">
                                    <button className={tab==='1'?"btn navButton":"btn navBarButton"}>
                                        Sotuv
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/report">
                                    <button className={tab==='2'?"btn navButton":"btn navBarButton"}>
                                        Hisobot
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/warehouse">
                                    <button className={tab==='3'?"btn navButton":"btn navBarButton"}>
                                        Ombor
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sellerReject">
                                    <button className={tab==='4'?"btn navButton":"btn navBarButton"}>
                                        Qaytgan Mollar
                                    </button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sellerDefect">
                                    <button className={tab==='5'?"btn navButton":"btn navBarButton"}>
                                        Defect
                                    </button>
                                </Link>
                            </li>
                            {/*<li className="nav-item">*/}
                            {/*    <Link to="/settings">*/}
                            {/*        Settings*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                            <li className="nav-item" onClick={logout}>
                                <Link to="/">
                                    <button className={tab==='6'?"btn navButton":"btn navBarButton"}>
                                        Chiqish
                                    </button>
                                </Link>
                            </li>
                            {/*<li className="nav-item"><button type="button" className="btn btn-outline-dark border-0" onClick={logout}>Chiqish</button></li>*/}
                        </ul>
                        :
                                <Redirect
                                    to={{
                                        pathname: '/'
                                    }}
                                />

            }
        </div>
    )
};
export default Navbar