import Admin from "./pages/Admin"
import Basket from "./pages/Basket"
import DevicePage from "./pages/DevicePage"
import Login from "./pages/Login"
import Registry from "./pages/Registry"
import Shop from "./pages/Shop"
import TypeDevices from "./pages/TypeDevices"
import { ADMIN_ROUTE, BASKET_ROUTE, DEVICES_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path:ADMIN_ROUTE,
        Component:Admin
    },
    {
        path:BASKET_ROUTE,
        Component:Basket
    }
]

export const publicRoutes = [
    {
        path:SHOP_ROUTE,
        Component:Shop
    },
    {
        path:DEVICES_ROUTE,
        Component:TypeDevices
    },
    {
        path:REGISTRATION_ROUTE,
        Component:Registry
    },
    {
        path:LOGIN_ROUTE,
        Component:Login
    },
    {
        path:DEVICE_ROUTE+'/:id',
        Component:DevicePage
    }
]