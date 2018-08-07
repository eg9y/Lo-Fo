/*
Push retrieved documents to the collection array
*/
export const pushDocuments = function (items, collection) {
  if (items) {
    items.forEach(doc => {
      let dataWithId = doc.data()
      dataWithId.id = doc.id
      // doc.data() is never undefined for query doc snapshots
      collection.push(dataWithId)
    })
  }
  return collection
}
