const mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Clouds Rest",
    image: "https://i.ytimg.com/vi/kJGSzyKNt4Y/maxresdefault.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum animi itaque, veritatis reiciendis ullam necessitatibus repudiandae ex voluptate esse, tenetur ipsa odio velit illum similique in cumque, cum minima! Corporis, quisquam autem non quia laboriosam sed sint corrupti. Voluptatibus ipsum esse ex doloremque dolorum officia blanditiis! Rerum natus praesentium animi.",
  },
  {
    name: "Clouds Rest",
    image:
      "https://sgp1.digitaloceanspaces.com/cosmosgroup/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum animi itaque, veritatis reiciendis ullam necessitatibus repudiandae ex voluptate esse, tenetur ipsa odio velit illum similique in cumque, cum minima! Corporis, quisquam autem non quia laboriosam sed sint corrupti. Voluptatibus ipsum esse ex doloremque dolorum officia blanditiis! Rerum natus praesentium animi.",
  },
  {
    name: "Clouds Rest",
    image:
      "https://www.coxgazette.com/media/imgAll/2020March/43e7fe38c8e320c6c2a9e6a3e5a62446-rimg-w720-h480-gmir-20200804064827.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum animi itaque, veritatis reiciendis ullam necessitatibus repudiandae ex voluptate esse, tenetur ipsa odio velit illum similique in cumque, cum minima! Corporis, quisquam autem non quia laboriosam sed sint corrupti. Voluptatibus ipsum esse ex doloremque dolorum officia blanditiis! Rerum natus praesentium animi.",
  },
];

function seedDB() {
  Campground.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("remove campgrounds!");
      //add a few campgrounds
      data.forEach(function (seed) {
        Campground.create(seed, function (err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            Comment.create(
              {
                text: "I miss my sajek trip",
                author: "Abu Saleh Faysal",
              },
              function (err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment!!");
                }
              }
            );
          }
        });
      });
    }
  });
  //add a few comments
}

module.exports = seedDB;
