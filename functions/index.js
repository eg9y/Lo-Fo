const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const env = functions.config();

// Initialize the Algoria Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey)
const index = client.initIndex('items');

exports.indexFoundItem = functions.firestore
    .document('/found-items/{foundItemId}')
    .onCreate((snap, context) => {
       return indexItem(snap);
    })

exports.indexLostItem = functions.firestore
    .document('/lost-items/{lostItemId}')
    .onCreate((snap, context) => {
       return indexItem(snap);
    })

function indexItem (snap) {
    const data = snap.data();
    data.objectId = snap.id;
    
    // Add the data to the algolia index
    return index.addObject(data)
}

exports.unindexFoundItem = functions.firestore  
    .document('/found-items/{foundItemId}')
    .onDelete((snap, contenxt) => {
        return unindexItem(snap);
    })

exports.unindexLostItem = functions.firestore  
    .document('/lost-items/{lostItemId}')
    .onDelete((snap, contenxt) => {
        return unindexItem(snap);
    })

function unindexItem (snap) {
    const objectId = snap.id;

    // Delete an ID from the index
    return index.deleteObject(objectId);
}

// admin.initializeApp(functions.config().firebase);

// exports.addFIrestoreDataToAlgolia = functions.https.onRequest((req, res) => {
//     let arr = [];
//     admin.firestore().collection("items").get().then((docs) => {
//         docs.forEach((doc) => {
//             const item = doc.data();
//             item.objectID = doc.id;
//             arr.push(item)
//         })
//         index.saveObjects(arr, (err, content) => {
//             if(err) {
//                 throw("ERROR::", err)
//             }
//             res.status(200).send(content);
//         })
//         return
//     }).catch((err) => {
//         console.log(err);
//     });
// })