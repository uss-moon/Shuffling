//================================================//
//         npm Packages                          //
//==============================================//
//ide-run.goorm.io/workspace/The_Shuffling?language=us&theme=-dark#
//keep the order

var mongoose              = require("mongoose"),
	flash				  = require("connect-flash"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	LocalStrategy         = require("passport-local"),
	methodOverride        = require("method-override"),
	passportLocalMongoose = require("passport-local-mongoose"),
	express               = require("express"),
	app                   = express();

//require routes
var indexRoutes       = require("./routes/index");

//configure mongoose
mongoose.connect("mongodb://localhost/the_shuffling", { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false });
//mongoose.connect("mongodb+srv://bhitt:cs4800mongodb@theshuffling-rk1we.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false });

//configre view engine
app.set("view engine","ejs");

//pathing to correct public file
app.use(express.static(__dirname + "/public"));
//method override for post
app.use(methodOverride("_method"));

//authentication stuff
app.use(require("express-session")({
	//statement used to encode the session
	secret: "You are the sun, we are the moon",
	resave: false,
	saveUninitialized: false
}));

//set up passport to work in application
app.use(passport.initialize());
app.use(passport.session());

//read the session, take data and decode it..... then encode it and put it back in the session 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//serve public files
app.use(express.static("public"));

// support json encoded bodies
app.use(bodyParser.json());

//parses info from the body of a page
app.use(bodyParser.urlencoded({extended: true}));

//initialize flash for flash messages
app.use(flash());

//middleware used in every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//import routes
app.use("/", indexRoutes);


//Default Route   - sends to index page, keep this route last
app.get("/*", function(req, res){
	res.redirect("/");
});

//listen or start server
app.listen(3000, function(){
	console.log("Server is listening on port 3000.....");
});