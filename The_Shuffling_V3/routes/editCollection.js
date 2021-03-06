// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk");

// Card Containers
var searchResults = [];
var collectionId;
var collection;

// GET REQUESTS //
router
  .get("/", (req, res) => {
    res.render("editCollection", {
      collection: collection,
      searchResults: searchResults
    });
  })
  .get("/:id", (req, res, next) => {
    //TODO: fetch all user collections from database
    collectionId = req.params.id;
    // filter selected collection
    collection = allCollections.find(c => collectionId.localeCompare(c._id) === 0); //middleware
    //TODO: Search collections using id //middleware
    res.redirect("/allCollections/editCollection/");
  })
  .get("/*", (req, res) => {
    res.redirect("/allCollections/editCollection/");
  });

// POST REQUESTS //
router
  // SEARH CARDS FROM MTG
  .post("/searchCards", async (req, res, next) => {
    let data = await searchMtg(req.body.searchKey);
    searchResults = data.map(card => {
      return {
        id: card.id,
        name: card.name,
        convertedManaCost: card.cmc,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        text: card.text
      };
    });
    res.redirect("editCollection/");
  })
  // ADD CARDS TO NEWCARDS CONTAINER
  .post("/addCards", (req, res, next) => {
    let id = req.body.id;
    let card = searchResults.find(card => {
      return id.localeCompare(card.id) === 0;
    });
    collection.cards.push(card);
    res.send({ card: card });
  })
  // REMOVE A CARD FROM NEWCARDS CONTAINER
  .post("/removeCards", (req, res, next) => {
    let id = req.body.id;
    collection.cards = collection.cards.filter(card => {
      return id.localeCompare(card.id) !== 0;
    });
    res.redirect("/");
  })
  // RESET NEWCARDS CONTAINER
  .post("/reset", (req, res, next) => {
    //empty cards in collection
    collection.cards.length = 0;
    allCollections.filter(collection => {
      collection.id !== collectionId;
    });
    res.redirect("/");
  })

  // TODO: ADD CARDS TO DATABASE
  .post("/addCardsToCollection", (req, res) => {
    res.redirect("/");
  });

// FUNCTIONS //
async function searchMtg(key, res) {
  let data = mtg.card
    .where({ name: key })
    .then(cards => {
      return cards;
    })
    .catch(err => console.log(err));
  return data;
}

module.exports = router;
