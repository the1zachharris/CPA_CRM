//provide your seed function and return the client types seed when called
module.exports = {
    seed : function(limit,offset,callback){
        callback(null,clienttypes);
    }
};

//set your clienttype seeds
var clienttypes =
[
  {
    "id": "Individual",
      "type": "Individual"
  },
  {
      "id": "S-Corp",
      "type": "S-Corp"
  },
  {
      "id": "C-Corp",
      "type": "C-Corp"
  },
  {
    "id": "SoleProprietorship",
      "type": "Sole Proprietorship"
  },
  {
    "id": "Partnership",
      "type": "Partnership"
  },
  {
    "id": "PLLC",
      "type": "PLLC"
  },
  {
    "id": "Corporation",
      "type": "Corporation"
  }
];
