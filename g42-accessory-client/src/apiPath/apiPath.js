export const apiPath={
    // Users
    getAllUsersByPageable:'user/all',
    getAllUsersRoleSeller:'user/all_seller',
    saveOrEditUser:'user/saveOrEdit',
    changeUserActive:'user/changeActive/',
    deleteUser:'user/remove/',

    // Shops
    getAllShopsByPageable:'shop/all',
    saveOrEditShop:'shop/saveOrEdit',
    changeShopActive:'shop/changeActive/',
    deleteShop:'shop/remove/',

    // Warehouses
    getAllWarehousesByPageable:'warehouse/all',
    saveOrEditWarehouse:'warehouse/saveOrEdit',
    changeWarehouseActive:'warehouse/changeActive/',
    deleteWarehouse:'warehouse/remove/',

    // Category
    getAllCategorysByPageable:'category/all',
    saveOrEditCategory:'category/saveOrEdit',
    deleteCategory:'category/remove/',

    // Product
    getAllProductByPageable:'product/all',
    addProduct:'product/addProduct',
    editProduct:'product/editProduct',
    changeProductActive:'product/changeActive/',
    deleteProduct:'product/remove/',


    //Transfer
    warehouses:'warehouse/allAll',
    searchProduct:'product/search',
    saveOrEditTransfer:'transfer/saveOrEdit',
    warehouseIncomes:'transfer/all?',
    acceptWarehouseIncome:'transfer/accept',
    removeWarehouseIncome:'transfer/remove',
    productCountByWarehouseId:'transfer/countProductByWarehouse?prodId=',


    //Trade
    saveOrEditTrade:'trade/saveOrEdit',
    getAllByFalseReport:'trade/getAllByDraftReport',
    deleteTrade:'trade/remove/',
    closeDay:'trade/closeDay/',

    //Report
    getAllReportByStatus:'report/getAllReportByStatus',
    acceptReport:'report/accept/',

    //Reject
    saveReject:'reject/saveOrEdit',
    allReject:'reject/all?',
    removeReject:'reject/remove/',
    acceptReject:'reject/accept/',

    //Defect
    saveOrEditDefect:'defect/saveOrEdit',
    allDefects:'defect/all?',
    acceptDefect:'defect/accept/',
    removeDefect: 'defect/remove/',


    //MainPage
    productCount:'dashboard/productCount?',

    totalCashFlow: 'dashboard/totalCashFlow'


}