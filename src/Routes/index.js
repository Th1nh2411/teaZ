import Home from '../Pages/Home';
import CheckoutPage from '../Pages/CheckoutPage';
import PaymentPage from '../Pages/PaymentPage';
import config from '../config';
import HistoryPage from '../Pages/HistoryPage/HistoryPage';
import FavorPage from '../Pages/FavorPage/FavorPage';

export const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.history, component: HistoryPage },
    { path: config.routes.checkout, component: CheckoutPage },
    { path: config.routes.payment, component: PaymentPage },
    { path: config.routes.favor, component: FavorPage },
];
