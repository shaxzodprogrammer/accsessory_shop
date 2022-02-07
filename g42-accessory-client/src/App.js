import React from "react";
import {applyMiddleware, compose, createStore} from 'redux'
import {rootReducer} from "./redux/reducers/RootReducer";
import thunkMiddleware from "redux-thunk";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import {routerMiddleware} from "react-router-redux";
import HomePage from "./pages/HomePage";
import {Provider} from "react-redux";
import PublicRoute from "./utills/PublicRoute";
import PrivateRoute from "./utills/PrivateRoute";
import MainPage from "./pages/MainPage";
import Report from "./pages/Report";
import Warehouse from "./pages/Warehouse";
import Transfer from "./pages/Transfer";
import Catalog from "./pages/Catalog";
import Settings from "./pages/Settings";
import SellerSale from "./pages/SellerSale";
import SellerReject from "./pages/SellerReject";
import SellerDefect from "./pages/SellerDefect";
import {ToastContainer} from "react-toastify";

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunkMiddleware, routeMiddleware]

const store = createStore(rootReducer, compose(
    applyMiddleware(...middlewares)
))
const App = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <ToastContainer/>
                <Switch>
                    <Route exact path="/mainPage" component={MainPage}/>
                    <Route exact path="/report" component={Report}/>
                    <Route exact path="/warehouse" component={Warehouse}/>
                    <Route exact path="/transfer" component={Transfer}/>
                    <Route exact path="/catalog" component={Catalog}/>

                    <Route exact path="/report" component={Report}/>
                    <Route exact path="/warehouse" component={Warehouse}/>
                    <Route exact path="/transfer" component={Transfer}/>
                    <Route exact path="/catalog" component={Catalog}/>

                    <Route exact path="/sellerSale" component={SellerSale}/>
                    <Route exact path="/transfer" component={Transfer}/>
                    <Route exact path="/report" component={Report}/>
                    <Route exact path="/warehouse" component={Warehouse}/>
                    <Route exact path="/sellerReject" component={SellerReject}/>
                    <Route exact path="/sellerDefect" component={SellerDefect}/>

                    <Route exact path="/settings" component={Settings}/>
                    <PublicRoute exact path="/" component={HomePage}/>
                </Switch>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
