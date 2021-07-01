import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { orderLiteActions } from '../../Redux/Actions/OrderActions'
import Car from '../../SericeApis/Car'
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { Box } from '@material-ui/core'
import { createCommentActions } from '../../Redux/Actions/CarActions'

export default function Feedback() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { order } = location.data

  const [reviews, setReviews] = useState({})

  const [waiting, setWaiting] = useState(true)

  const userinfo = useSelector(state => state.login)
  const { user } = userinfo
  const [itemdetail, setItemdetail] = useState([])

  const lites = useSelector(state => state.orderlite)
  const { loading } = lites
  useEffect(() => {
    dispatch(orderLiteActions(order.order_name))
  }, [order])

  useEffect(() => {
    setWaiting(true)
    if (!loading) {
      lites.orderlite.map((lite) => {
        Car.getCar(lite.lite_car_id).then((cardata) => {
          if (lite.lite_order_name == order.order_name) {
            setItemdetail(itemdetail => [...itemdetail, {
              carnumber: cardata.car_number,
              carprice: cardata.car_price,
              carmanufacturer: cardata.car_manufacturer,
              carmodel: cardata.car_model,
              liteprice: lite.lite_price,
              litedays: lite.lite_days,
              carimages: cardata.car_images,
              rating: 0,
              review: ''
            }])
            const num = cardata.car_number
            //setReviews({ ...reviews, [cardata.car_number]: { rating: 0, review: '' }})
          }
        })
      })
    }
    setWaiting(false)
  }, [lites])

  const useStyles = makeStyles({
    root: {
      width: 200,
      display: 'flex',
      alignItems: 'center',
    },
  })

  const [hover, setHover] = React.useState(-1);
  const classes = useStyles()

  const writeReview = field => event => {
    setReviews({ ...reviews,  [field]: event.target.value})
  }

  const writeRating = (field, rat) => {
    setReviews({ ...reviews, [field]: rat})
  }

  const sendReview = () => {
    /* dispatch(createCommentActions(user.user_id, itemdetail[0].carnumber, { carco_rating: reviews.rat, carco_comment: reviews.rev })).then((res) => {
      console.log('carnum', itemdetail[0].carnumber)
      console.log('stat', res.data.status)
      console.log('data', res.data.data)
      if (res.data.status == 201) window.location="/"
    }) */
    Car.setComment(user.user_id, itemdetail[0].carnumber, { carco_rating: reviews.rating, carco_comment: reviews.rev }).then((res) => {
      console.log('send', reviews)
      console.log('res c', res)
      console.log('stat', res.status)
      if (res.status == 201) window.location="/"
    })
  }

  return (
    <div className="pt-28 px-16">
      <div className="text-xl mb-7">Write Your helpful feedback to Us an other <strong className="text-red-600"><em>Rentgers</em></strong></div>
      <div>
        {
          waiting ?
            ''
            :
            itemdetail.map((item, index) => (
              <div className="bg-blue-200 px-3 rounded-xl shadow-lg w-1/2 my-3">
                <div className="flex">
                  <div className="my-auto">
                    <img img src={item ? `http://localhost:3000/api/caim/cardata/${item.carnumber}/${item.carimages.map((image) => { if (image.caim_primary === true) return image.caim_filename }).join('')}` : ''}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://genesisairway.com/wp-content/uploads/2019/05/no-image.jpg" }}
                      className="w-28 h-20v object-cover overflow-hidden" />
                  </div>
                  <div className="ml-4">
                    <div className="flex">
                      <div className="mx-2 text-lg font-semibold mt-2 max-w-xs">{item.carmanufacturer} {item.carmodel}</div>
                      <div className="text-lg mt-2">Rp{item.liteprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</div>
                    </div>
                    <div className={classes.root}>
                      <Rating
                        name="hover-feedback"
                        value={item.rating}
                        precision={1}
                        onChange={(event, newValue) => {
                          writeRating('rating', newValue);
                          item.rating = newValue
                        }}
                        onChangeActive={(event, newHover) => {
                          setHover(newHover);
                        }}
                      />
                    </div>
                    <textarea placeholder="Rentcar.id is awesome" maxLength={450} rows={2} onChange={writeReview('rev')}
                        className="bg-blue-100 hover:bg-red-200 focus:bg-red-200 block w-96 border-none rounded-xl focus:ring-0 mb-3"
                      />
                  </div>
                </div>
              </div>
            ))
        }
      </div>
      <button onClick={() => sendReview()}
        className="ml-10 bg-blue-500 text-white py-2 px-3 rounded-full mb-8 hover:transform hover:scale-110 focus:outline-none"
      >
        Send Feedback
      </button>
    </div>
  )
}