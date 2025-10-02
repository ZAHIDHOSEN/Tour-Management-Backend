
import { tourSearchableField } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.models";
import { queryBuilder } from "../../utilis/queryBuilder";





const createTour = async(payload:ITour) =>{
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    //   const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-")
    //    let slug = `${baseSlug}`
    
    //    let counter = 0;
    //    while(await Tour.exists({slug})){
    //     slug = `${slug}-${counter++}`
    //    }
    //   payload.slug = slug;

   const tour = await Tour.create(payload)

    return {
        tour
    }



}


const getAllTour = async(query: Record<string,string>) =>{

    const queryBuilders = new queryBuilder(Tour.find(),query)
    const tours =await queryBuilders.
    search(tourSearchableField).
    filter().
    fields().
    pagination()
    // build()

    // const meta = await queryBuilders.getMeta()

    const [data,meta] = await Promise.all([
        tours.build(),
        queryBuilders.getMeta()
    ])

    return {
        data,
        meta
    }
}

// const getAllTour = async(query: Record<string,string>) =>{
//     const filter = query;
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt"
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page-1) *limit


//     // field filtering
//     const fields = query.fields?.split(",").join(" ") || ""
//     // delete filter["searchTerm"]
//     // delete filter["sort"]

    
//     for(const field of excludedField){
          
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field]
//     }



//     const searchQuery = {
//         $or: tourSearchableField.map(field => {
//             return {
//                 [field]: {$regex: searchTerm, $options:"i"}
//             }
//         })
//     }
//     // const tour = await Tour.find(
//         // title: {$regex: searchTerm, $options:"i"}
//         // $or: [
//         //     {title: {$regex: searchTerm, $options:"i"}},
//         //     {description: {$regex: searchTerm, $options:"i"}},
//         //     {location: {$regex: searchTerm, $options:"i"}}
//         // ]
//     //     searchQuery
//     // ).find(filter).sort(sort).select(fields).skip(skip).limit(limit)

//     const filterQuery = Tour.find(filter)
//     const tours = filterQuery.find(searchQuery)
//     const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)
    
//     const totalTour = await Tour.countDocuments()
//     const totalPages = Math.ceil(totalTour/limit)

//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTour,
//         totalPages: totalPages,
        
//     }

//     return {
//            data:allTours,
//          meta:{
//            total: meta
//          }
//     }
// }

const updateTour = async(id:string,payload:Partial<ITour>)=>{
   const existingTour = await Tour.findById(id)

   if(!existingTour){
       throw new Error("Tour not found")
   }

    //  if(payload.title){
    //            const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-")
    //            let slug = `${baseSlug}`
   
    //          let counter = 0;
    //           while(await Tour.exists({slug})){
    //           slug = `${slug}-${counter++}`
    //          }
    //          payload.slug = slug;
    //    } 

   const updatedTour = await Tour.findByIdAndUpdate(id,payload,{new: true})

   return updatedTour

}

const deleteTour = async(id: string) =>{
    const isTourExits = await Tour.findById(id)
    if(!isTourExits){
        throw new Error("Tour didnot exits")
    } 

    const tour = await Tour.findByIdAndDelete(id)

    return tour
}






// create tourType
const createTourType = async (payload: ITourType) =>{
    const {name} = payload
    const existingTourType = await TourType.findOne({name})

    if(existingTourType){
        throw new Error("Tour type already exists")
    }

    const tourType = await TourType.create({name})

    return tourType


}

const getAllTourType = async() =>{
    const tourType = await TourType.find({})
    const totalTourType = await TourType.countDocuments()

    return {
           data: tourType,
         meta:{
           total: totalTourType
         }
    }
}

const updateTourType = async(id: string, payload: ITourType) =>{
    const tourType = await TourType.findById(id)
    if(!tourType){
        throw new Error("Tour type not found")

    }
    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {new:true})

    return updatedTourType
}

const deleteTourType = async(id: string)=>{
       const tourType = await TourType.findById(id)
       if(!tourType){
        throw new Error("Tour type not found")
       }

        const deletedTourType = await TourType.findByIdAndDelete(id)
        return deletedTourType

}


export const tourServices = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourType,
    updateTourType,
    deleteTourType
}