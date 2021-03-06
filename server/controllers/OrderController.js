import { sequelize } from "../../config/config-db"

const createOrder = async (req, res, next) => {
    try {
        const notAvailable = req.isAvailable
        if (notAvailable) return res.status(404).send({ message: 'Selected car is not availabe for now.' })

        const summary = req.summary
        if (!summary) return res.status(404).send({ message: 'Order summary not found.' })
        if (summary.lite_status !== 'cart') return res.status(400).send({ message: 'All car should be in cart to be ordered.' })

        const cart = req.existscartid

        let { total_discount, total_due, total_days } = summary
        const beforeTax = total_due - total_discount
        const order_tax = parseInt(0.1 * beforeTax)
        const afterTax = parseInt(beforeTax + order_tax)
        const { order_city, order_address, order_phone } = req.body
console.log('ph2', order_phone)
        const order = await req.context.models.Order.create(
            {
                order_discount: total_discount,
                order_tax: order_tax,
                order_total_due: afterTax,
                order_total_days: total_days,
                order_city: order_city,
                order_address: order_address,
                order_phone: order_phone,
                order_status: 'open',
                order_user_id: cart.cart_user_id
            }
        )
        if (!order) return res.status(500).send({ message: 'Failed to create order.' })
        req.orderdata = order
        next()
    } catch (error) {
        return res.status(500).send({ message: `Create order ${error}.` })
    }
}

const getOrderByUser = async (req, res) => {
    try {
        const orders = await req.context.models.Order.findAll({
            where: { order_user_id: req.params.id },
            order: [
                ['order_created_on', 'DESC']
            ]
        })
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({ message: `Get order by user ${error}.` })
    }
}

const getOrderByName = async (req, res) => {
    try {
        const order = await req.context.models.Order.findOne({
            where: { order_name: req.params.name }
        })
        return res.status(200).send(order)
    } catch (error) {
        return res.status(500).send({ message: `Get order by name ${error}.` })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const order = await req.context.models.Order.findAll({
            order: [
                ['order_name', 'DESC']
            ]
        })
        return res.status(200).send(order)
    } catch (error) {
        return res.status(500).send({ message: `Get all order ${error}.` })
    }
}

const findOrderByName = async (req, res, next) => {
    try {
        const order = await req.context.models.Order.findOne({
            where: { order_name: req.params.name }
        })
        req.oldorder = order
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find order by name ${error}.` })
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const status = req.params.status
        console.log('upd stat', status)
        let { pyt_num } = req.body
        const oldorder = req.oldorder
        if (!oldorder) return res.status(404).send({ message: 'Order to be updated not found.'})
        if (!pyt_num) pyt_num = oldorder.order_pay_trx_number

        const newOrder = await req.context.models.Order.update(
            {
                order_status: status,
                order_pay_trx_number: pyt_num
            },
            {
                returning: true,
                where: { order_name: req.params.name }
            }
        )
        if (!newOrder[0]) return res.status(500).send({ message: `Failed to update order.`})
        if (status !== 'closed' && status !== 'cancelled') return res.status(201).send(newOrder[1][0])
        req.neworder = newOrder[1][0]
        console.log('go to cancel')
        next()
    } catch (error) {
        return res.status(500).send({ message: `Update order ${error}.`})
    }
}

const countOrder = async (req, res) => {
    try {
        const ordercount = await sequelize.query(
            "select count(order_name) as all_order, sum(case when order_status = 'open' then 1 else 0 end) as open_order, sum(case when order_status = 'paid' then 1 else 0 end) as paid_order, sum(case when order_status = 'cancelled' then 1 else 0 end) as cancelled_order, sum(case when order_status = 'rent' then 1 else 0 end) as active_order, sum(case when order_status = 'closed' then 1 else 0 end) as closed_order from orders",
            { type: sequelize.QueryTypes.SELECT }
        )
        return res.status(200).send(ordercount[0])
    } catch (error) {
        return res.status(500).send({ message: `Count order ${error}.`})
    }
}

export default {
    createOrder,
    getOrderByUser,
    getOrderByName,
    getAllOrder,
    findOrderByName,
    updateOrder,
    countOrder,
}