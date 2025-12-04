/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.models"
import { isActive} from "../user/user.interface"
import { User } from "../user/user.models"

const now = new Date()

const sevenDayAgo = new Date(now).setDate(now.getDate()-7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate()-30) 



const getUserStats = async()=>{
  const totalUsersPromise = User.countDocuments()

  const totalActiveUserPromise = User.countDocuments({isActive: isActive.ACTIVE})
  const totalInActiveUserPromise = User.countDocuments({isActive: isActive.INACTIVE})
  const totalBlockUserPromise = User.countDocuments({isActive: isActive.BLOCKED})

 const newUserInLast7DaysPromise = User.countDocuments({
     createdAt:{ $gte:sevenDayAgo}
     
  })
  const newUserInLast30DaysPromise = User.countDocuments({
     createdAt:{ $gte:thirtyDaysAgo}
     
  })

  const userByRolePromise = User.aggregate([
    {
       $group:{
        _id:"$role",
        count:{$sum:1}
       } 
    }
  ])


const [totalUser,totalActiveUsers,totalInActiveUser,
    totalBlockUser,newUserInLast7Days,newUserInLast30Days,
    userByRole]= await Promise.all([
    totalUsersPromise,
    totalActiveUserPromise,
    totalInActiveUserPromise,
    totalBlockUserPromise,
    newUserInLast7DaysPromise,
    newUserInLast30DaysPromise,
    userByRolePromise
  ])

  

    return {
        totalUser,
        totalActiveUsers,
        totalInActiveUser,
        totalBlockUser,
        newUserInLast30Days,
        newUserInLast7Days,
        userByRole
    }
}


const getTourStats = async()=>{

    const totalTourPromise = Tour.countDocuments()

    const totalTourTypePromise = Tour.aggregate([
        // stage-1 connect tour type model lookup stage

        {
            $lookup:{
               from: "tourtypes",
               localField:"tourType",
               foreignField:"_id",
               as:"type"
            }
        },
        // unwind the array to object
        {
            $unwind: "$type"
        },
        // stage-3 grouping tour types

        {    $group:{
            _id: "$type.name",
            count:{$sum: 1}
            }
            
        },

         
    ])

    const averageTourCostPromise = Tour.aggregate([

        // {
        // $addFields: {
        //     costFormInt: { $toInt: "$costForm" } // Convert string → number
        // }
        // },

         {
            $group: {
                _id:null,
                averageCostFrom: {$avg:"$costForm"}
            }
         }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
        //     {
        //    $addFields: {
        //    divisionObj: { $toObjectId: "$division" }
        //      }
        //  },
          {
            $lookup:{
               from: "divisions",
               localField:"division",
               foreignField:"_id",
               as:"division"
            }
        },
        // unwind the array to object
        {
            $unwind: "$division"
        },
        // stage-3 grouping tour types

        {    $group:{
            _id: "$division.name",
            count:{$sum: 1}
            }
            
        },
          
    ])


    const totalHighestBookTourPromise = Booking.aggregate([
        //stage-1 : group the tour  
        {
            $group:{
                _id:"$tour",
                bookingCount:{$sum:1}
            }
        },
        // stage-2 sort the tour
        {
            $sort:{bookingCount: -1}
        },
        // stage 3 short 
        {
            $limit: 5
        },
        // stage-4 lookup stage
        {
           $lookup:{
              from:"tours",
              let:{tourId: "$_id"},
              pipeline:[
                {
                    $match:{
                       $expr:{$eq: ["$_id","$$tourId"]} 
                    }
                }
              ],
              as:"tour"
           }
        },
        // stage-5 unwind stage
        {
           $unwind:"$tour"
        },
        // stage-6 project stage
        {
          $project:{
            bookingCount: 1,
            "tour.title": 1,
            "tour.slug": 1
          }
        }
    ])

    const [totalTour,totalTourType,averageTourCost,
        totalTourByDivision,totalHighestBookTour ] = await Promise.all([
        totalTourPromise,
        totalTourTypePromise,
        averageTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookTourPromise
        
    ])


    return {
        totalTour  ,
        totalTourType,
        averageTourCost,
        totalTourByDivision,
        totalHighestBookTour
    }
}


const getBookingStats = async()=>{

    const totalBookingPromise = Booking.countDocuments()
    
    const totalBookingByStatusPromise = Booking.aggregate([
        {
           $group: {
             _id:"$status",
             count:{$sum: 1}
           } 
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([
        // stage-1 
        {
            $group:{
                _id:"$tour",
                bookingCount:{$sum:1}
            }
        },
        // stage-2 sort stage
        {
            $sort: {bookingCount: -1}
        },
        // stage-3 limit stage
        {
            $limit:10
        },
        // stage-4
        {
            $lookup:{
                from:"tours",
                localField:"_id",
                foreignField:"_id",
                as:"tour"

            }
        },
        // stage-5 unwind stage 
        {
            $unwind:"$tour"
        },
        // project stage
        {
            $project:{
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1,
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group:{
                _id:null,
                aveGuestCount:{$avg:"$guestCount"}
            }
        }
    ])


    const bookingLast7DaysPromise = Booking.countDocuments({
        createdAt:{$gte: sevenDayAgo}
    })
    const bookingLast30DaysPromise = Booking.countDocuments({
        createdAt:{$gte: sevenDayAgo}
    })


    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user:any)=>user.length)


    


    const [totalBooking, totalBookingByStatus,bookingPerTour,avgGuestCountPerBooking,
        bookingLast7Days,bookingLast30Days, totalBookingByUniqueUsers] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DaysPromise,
        bookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise 
    ])


    return {
        totalBooking,
         totalBookingByStatus,
         bookingPerTour,
         avgGuestCountPerBooking:avgGuestCountPerBooking[0].aveGuestCount,
         bookingLast7Days,
        bookingLast30Days,
        totalBookingByUniqueUsers
    }
}
const getPaymentStats = async()=>{
   
    const totalPaymentPromise = Payment.countDocuments()


      const totalPaymentByStatusPromise = Payment.aggregate([
      {
        $group:{
            _id:"$status",
            count:{$sum:1}
        }
      }  
    ])

    const totalRevenuePromise = Payment.aggregate([
        //stage-1 match
        {
            $match:{status:PAYMENT_STATUS.PAID}
        },
        // 
        {
            $group:{
                _id:null,
                totalRevenue: {$sum:"$amount"}
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        {
            $group:{
               _id:null,
               averagePaymentAmount :{$avg:"$amount"} 
            }
        }
    ])


     const paymentGatewayDataPromise = Payment.aggregate([
        {
           $group:{
            _id:{$ifNull: ["$paymentGatewayData.status","UNKNOWN"]},
            count:{$sum:1}
           } 
        }
     ])

  

    const [totalPayment, totalPaymentByStatus,totalRevenue,avgPaymentAmount,paymentGatewayData] = await Promise.all([
      totalPaymentPromise,
      totalPaymentByStatusPromise,
      totalRevenuePromise,
      avgPaymentAmountPromise,
      paymentGatewayDataPromise
      
    ])

   

    return {
        totalPayment,
        totalPaymentByStatus,
        totalRevenue,
        avgPaymentAmount,
        paymentGatewayData
        
    }
}








export const StatsServices = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}