const createOrder = async (req, res, next) => {
    try {
        const notAvailable = req.isAvailable
        if (notAvailable) return res.status(404).send({ message: 'Selected car is not availabe for now.' })

        const summary = req.summary
        if (!summary) return res.status(404).send({ message: 'Order summary not found.' })
        if (summary.lite_status !== 'cart') return res.status(400).send({ message: 'All car should be in cart to be ordered.' })

        const cart = req.existscartid

        let { total_discount, total_due, total_days, total_car } = summary
        if (total_discount = 0 && total_car > 2) total_discount = total_due * 0.15
        const beforeTax = total_due - total_discount
        const order_tax = parseInt(0.1 * beforeTax)
        const afterTax = parseInt(beforeTax + order_tax)
        const { order_city, order_address } = req.body

        const order = await req.context.models.Order.create(
            {
                order_discount: total_discount,
                order_tax: order_tax,
                order_total_due: afterTax,
                order_total_days: total_days,
                order_city: order_city,
                order_address: order_address,
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

const getAllOrder = async (req, res) => {
    try {
        const order = await req.context.models.Order.findAll()
        return res.status(201).send({ order })
    } catch (error) {
        return res.status(500).send({ message: `Get all order ${error}.` })
    }
}

export default {
    createOrder,
    getAllOrder
}