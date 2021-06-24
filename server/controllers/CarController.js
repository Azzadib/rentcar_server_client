import fs from 'fs'
import path from 'path'
//import { sequelize } from '../../config/config-db'
import Sequelize from 'sequelize'
import { sequelize } from '../../config/config-db'

const photoDir = process.cwd() + '/images'

const Op = Sequelize.Op

const listPassenger = [2, 3, 5, 8, 10]
const listDoor = [2, 4, 5]
const listType = ['sedan', 'suv', 'truck']

const findAllCar = async (req, res) => {
    try {
        const cars = await req.context.models.Car.findAll(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                ],
                order: [
                    ['car_manufacturer', 'ASC'],
                    ['car_model', 'ASC'],
                    ['car_number', 'ASC'],
                ],
            }
        )
        return res.status(200).send(cars)
    } catch (error) {
        return res.status(500).send({ message: `Find all car ${error}.` })
    }
}

const findAllCarType = async (req, res) => {
    try {
        if (listType.indexOf(req.params.type) === -1) return res.status(404).send({message: 'Car with searched type not found.'})
        const { limit, page, manufac, pssngr, order, sort, maxprice, minprice, search } = req.query
        let condition = { car_type: req.params.type }

        if (search) condition = { ...condition, [Op.or]: [{ car_manufacturer: { [Op.iLike]: `%${search}%` }}, { car_model: { [Op.iLike]: `%${search}%` }}]}
        if (maxprice || minprice) {
            if (maxprice && minprice)  condition = { ...condition, car_price: { [Op.lte]: maxprice, [Op.gte]: minprice } }
            else if (maxprice && !minprice)  condition = { ...condition, car_price: { [Op.lte]: maxprice } }
            else if (minprice && !maxprice)  condition = { ...condition, car_price: { [Op.gte]: minprice } }
        } 

        if (manufac) condition = { ...condition, car_manufacturer: { [Op.iLike]: manufac }}
        if (pssngr) condition = { ...condition, car_passenger: pssngr }
        const carlimit = limit? limit : 8
        const carpage = page? page : 1
        const carorder = order? order : 'car_number'
        const carsort = sort? sort : 'ASC'
        const offset = carlimit * (carpage-1)
        
        const cars = await req.context.models.Car.findAndCountAll(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                ],
                order: [
                    [carorder, carsort],
                ],
                where: condition,
                limit: carlimit,
                offset: offset,
                distinct: true
            }
        )
        const pages = Math.ceil(cars.count / carlimit)
        return res.status(200).send({ pages: pages, page: carpage, count: cars.count, rows: cars.rows })
    } catch (error) {
        return res.status(500).send({ message: `Find all car type ${error}.` })
    }
}

const findOneCar = async (req, res) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                    { model: req.context.models.LineItem }
                ],
                where: { car_id: req.params.id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car not found.' })
        return res.status(200).send(car)
    } catch (error) {
        return res.status(500).send({ message: `Find one car ${error}.` })
    }
}

const findOneCarID = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                where: { car_id: req.params.id }
            }
        )
        req.existscar = car
        if (car) {
            req.params.id = car.car_id
            req.number = car.car_number
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find one car ID ${error}.` })
    }
}

const findOneCarNum = async (req, res, next) => {
    try {
        if (req.params.id !== undefined && req.params.number === undefined) req.params.number = req.params.id
        if (req.params.number === undefined || !req.params.number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                    { model: req.context.models.LineItem }
                ],
                where: { car_number: req.params.number }
            }
        )
        if ((req.params.folder === undefined || req.number !== undefined) && (req.body.carco_comment == undefined || req.body.carco_rating === undefined) && req.body.lite_days === undefined) return res.status(200).send(car)
        req.existsnumber = car
        if (car) {
            req.params.id = car.car_id
            req.params.number = car.car_number
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find one car number ${error}.` })
    }
}

const createCar = async (req, res, next) => {
    try {
        if (req.existsnumber) return res.status(400).send({ message: 'Car number already exists.' })
        let { car_manufacturer, car_model, car_price, car_passenger, car_baggage, car_door, car_ac, car_type, car_user_id, car_description } = req.dataUploaded.fields

        const car_number = req.params.number
        if (!car_number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) return res.status(400).send({ message: 'Car number format is wrong.' })

        if (isNaN(car_price)) return res.status(400).send({ message: `Price should be a number. Found: ${car_price}.` })
        if (car_price < 0) return res.status(400).send({ message: `Price should be a positive number.  Found: ${car_price}.` })

        if (isNaN(car_passenger)) return res.status(400).send({ message: `Passenger should be a number. Found: ${car_passenger}.` })
        car_passenger = parseInt(car_passenger)
        if (listPassenger.indexOf(car_passenger) === -1) return res.status(400).send({ message: `Passenger only accept 2, 3, 5, 8 or 10 as value. Found: ${car_passenger}.` })

        car_baggage = parseInt(car_baggage)
        if (car_baggage !== 0 && car_baggage !== 1) return res.status(400).send({ message: `Baggage should be 0 or 1. Found: ${car_baggage}.` })

        if (isNaN(car_door)) return res.status(400).send({ message: `Door should be a number. Found: ${car_door}.` })
        car_door = parseInt(car_door)
        if (listDoor.indexOf(car_door) === -1) return res.status(400).send({ message: `Door only accept 2, 4 or 5 as value. Found: ${car_door}.` })

        car_ac = parseInt(car_ac)
        if (car_ac !== 0 && car_ac !== 1) return res.status(400).send({ message: `Ac should be 0 or 1. Found: ${car_ac}.` })

        if (!car_type) return res.status(400).send({ message: 'Type can\'t be null.' })
        if (listType.indexOf(car_type.toLowerCase()) === -1) return res.status(400).send({ message: `Type only accept Sedan, SUV or Truck as value. Found: ${car_type}.` })

        const car = await req.context.models.Car.create(
            {
                car_number: car_number,
                car_manufacturer: car_manufacturer,
                car_model: car_model,
                car_price: car_price,
                car_passenger: car_passenger,
                car_baggage: car_baggage,
                car_door: car_door,
                car_ac: car_ac,
                car_type: car_type.toLowerCase(),
                car_description: car_description,
                car_user_id: car_user_id
            }
        )
        if (!car.car_id) return res.status(500).send({ message: 'Failed to create car.' })

        req.params.id = car.car_id
        req.params.number = car.car_number
        next()
    } catch (error) {
        return res.status(500).send({ message: `Create car ${error}` })
    }
}

const updateCar = async (req, res) => {
    try {
        const oldCar = req.existscar
        if (!oldCar) return res.status(404).send({ message: 'Car to be updated not found.' })

        let { car_manufacturer, car_model, car_price, car_passenger, car_baggage, car_door, car_ac, car_type, car_description, car_user_id } = req.body

        if (!car_manufacturer) car_manufacturer = oldCar.car_manufacturer
        if (!car_model) car_model = oldCar.car_model

        if (car_price === undefined) car_price = oldCar.car_price
        if (isNaN(car_price) || car_price < 0) res.status(400).send({ message: `Price should be a positive number. Found: ${car_price}.` })

        if (car_passenger === undefined) car_passenger = oldCar.car_passenger
        if (listPassenger.indexOf(car_passenger) === -1) return res.status(400).send({ message: `Passenger only accept 2, 3, 5, 8 or 10 as value. Found: ${car_passenger}.` })

        if (car_baggage === undefined) car_baggage = oldCar.car_baggage
        else if (car_baggage !== 0 && car_baggage !== 1) return res.status(400).send({ message: `Baggage should be 0 or 1. Found: ${car_baggage}.` })

        if (car_door === undefined) car_door = oldCar.car_door
        if (listDoor.indexOf(car_door) === -1) return res.status(400).send({ message: `Door only accept 2, 4 or 5 as value. Found: ${car_door}.` })

        if (car_ac === undefined) car_ac = oldCar.car_ac
        else if (car_ac !== 0 && car_ac !== 1) return res.status(400).send({ message: `Ac should be 0 or 1. Found: ${car_ac}.` })

        if (car_type === undefined) car_type = oldCar.car_type
        if (listType.indexOf(car_type.toLowerCase()) === -1) return res.status(400).send({ message: `Type only accept Sedan, SUV or Truck as value. Found: ${car_type}.` })

        if (car_description === undefined) car_description = oldCar.car_description

        let car_rating = undefined
        const rating = req.rating
        rating? car_rating = rating.car_rating.toFixed(1) : oldCar.car_rating

        const newCar = await req.context.models.Car.update(
            {
                car_manufacturer: car_manufacturer,
                car_model: car_model,
                car_price: car_price,
                car_passenger: car_passenger,
                car_baggage: car_baggage,
                car_door: car_door,
                car_ac: car_ac,
                car_type: car_type.toLowerCase(),
                car_description: car_description,
                car_rating: car_rating,
                car_user_id: car_user_id
            },
            {
                returning: true, where: { car_id: req.params.id }
            }
        )
        if (!newCar[0]) return res.status(500).send({ message: 'Failed to update car.' })
        if (req.comment) return res.status(201).send(req.comment)
        return res.status(201).send(newCar[1][0])
    } catch (error) {
        return res.status(500).send({ message: `Update car ${error}. car_rating: ${car_rating}` })
    }
}

let notAvailable = []
const carAvailable = async (req, res, next) => {
    try {
        const selectedCar = req.proceedlite
        if (!selectedCar) return res.status(404).send({ message: 'Can\'t order unknown car.' })

        for (const item of selectedCar) {
            await checkAvailable(req, res, item)
        }
        req.isAvailable = notAvailable.length
        next()
    } catch (error) {
        return res.status(500).send({ message: `Car available ${error}.` })
    }
}

const checkAvailable = async (req, res, item) => {
    try {
        const car = await req.context.models.Car.findOne(
            {
                where: { car_id: item.lite_car_id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car to be rent not found.' })
        if (car.car_user_id !== null) notAvailable.push(car.car_id)
    } catch (error) {
        return res.status(500).send({ message: `Check available ${error}.` })
    }
}

const rentCar = async (req, res) => {
    try {
        const order = req.orderdata
        const selectedCar = req.proceedlite
        if (!selectedCar) return res.status(404).send({ message: 'Can\'t order unknown car.' })

        for (const item of selectedCar) {
            await setNotAvailable(req, res, item, order)
        }
        return res.status(201).send(order)
    } catch (error) {
        return res.status(500).send({ message: `Rent car ${error}.` })
    }
}

const setNotAvailable = async (req, res, item, order) => {
    try {
        const car = await req.context.models.Car.update(
            { car_user_id: order.order_user_id },
            {
                returning: true,
                where: { car_id: item.lite_car_id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car to be rent not found.' })
    } catch (error) {
        return res.status(500).send({ message: `Set not available ${error}.` })
    }
}

const resetCar = async (req, res) => {
    try {
        const selectedCar = req.resetcar
        const order = req.neworder

        for (const item of selectedCar) {
            await setAvailable(req, res, item)
        }
        return res.status(201).send(order)
    } catch (error) {
        return res.status(500).send({ message: `Reset car ${error}.` })
    }
}

const setAvailable = async (req, res, item) => {
    try {
        const car = await req.context.models.Car.update(
            { car_user_id: null },
            {
                returning: true,
                where: { car_id: item.lite_car_id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car to be reset not found.' })
    } catch (error) {
        return res.status(500).send({ message: `Set available ${error}.` })
    }
}

const deleteCar = async (req, res) => {
    try {
        const toDeleteCar = req.existscar
        if (!toDeleteCar) res.status(404).send({ message: 'Car to be deleted not found.' })

        await req.context.models.Car.destroy(
            {
                where: { car_id: toDeleteCar.car_id }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ message: 'Failed to delete Car.' })
            if (fs.existsSync(path.join(photoDir + '/cardata' + `/${toDeleteCar.car_number}/`))) fs.rmdirSync(path.join(photoDir + '/cardata' + `/${toDeleteCar.car_number}/`), { recursive: true })
            res.status(200).send({ message: 'Car deleted.' })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete car ${error}.` })
    }
}

const countCar = async (req, res) => {
    try {
        const carcount = await sequelize.query(
            "select count(car_number) as all_car, sum(case when car_type = 'sedan' then 1 else 0 end) as total_sedan, sum(case when car_type = 'suv' then 1 else 0 end) as total_suv, sum(case when car_type = 'truck' then 1 else 0 end) as total_truck from cars",
            { type: sequelize.QueryTypes.SELECT }
        )
        return res.status(200).send(carcount[0])
    } catch (error) {
        return res.status(500).send({ message: `Count car ${error}.`})
    }
}

export default {
    findAllCar,
    findAllCarType,
    findOneCar,
    findOneCarID,
    findOneCarNum,
    createCar,
    updateCar,
    carAvailable,
    rentCar,
    resetCar,
    deleteCar,
    countCar,
}