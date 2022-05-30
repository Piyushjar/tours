// const fs=require('fs');
const Tour =require('./../models/tourModel');
// const tours=JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId=(req,res,next,val)=>{
//     console.log(`The id is ${val}`);
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         res.status(404).json({
//             status: 'fail',
//             message: 'Either name or price is missing'
//         })
//     }
//     next();
// };


exports.aliasTopTours =(req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

//ROUTE HANDLERS
//get request on api
exports.getAllTours = async (req,res)=>{ 
    try{
        //BUILD QUERY
        //1A) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //2) Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        //sort('price ratingsAverage') in mongodb
        }
        else{
            query = query.sort('-createdAt');
        }
        
        //3) Field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else{
            query = query.select('-__v');
        }

        //4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page-1) * limit;

        //page=2&limit=10, 1-10 in page 1, 11-20 in page 2....
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist');
        }

        //EXECUTE QUERY
        const tours = await query;
        //query.sort().select().skip().limit()

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: { //envelope
                tours: tours
            }
        }); 
    }
    catch(err){
        res.status(404).json({
            status: 'error',
            message: err
        });
    }
};

//get request on api
exports.getTour = async (req,res)=>{    
    //Tour.findOne({_id:req.params.id})
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'error',
            message: err
        });
    }
};

//post request on api
exports.createTour = async (req,res)=>{
    // const newTour = new Tour();
    // newTour.save()
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: 'error',
            message: err
        });
    }
};

//patch request on api
exports.updateTour = async (req,res)=>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,
            {   new:true,
                runValidators:true
            });
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: 'error',
            message: err
        });
    }
};

//delete request on api
exports.deleteTour = async (req,res)=>{
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            message: null
        });
    }
    catch(err){
        res.status(400).json({
            status: 'error',
            message: err
        });
    }
};