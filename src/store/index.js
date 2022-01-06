import { createStore } from 'vuex'
import user from '../store/modules/user'
import stock from '../store/modules/stock'

const store = createStore({
    modules: {
        user, stock
    }
})
export default store