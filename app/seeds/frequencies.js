//provide your seed function and return the frequencies seed when called
module.exports = {
    seed : function(limit,offset,callback){
        callback(null,frequencies);
    }
};

//set your frequencies seeds
var frequencies =
[
  {
    "frequency": "Daily"
  },
  {
    "frequency": "Weekly"
  },
  {
    "frequency": "Monthly"
  },
  {
    "frequency": "Monthly EOM"
  },
  {
    "frequency": "Quarterly EOM"
  },
  {
    "frequency": "Annual EOM"
  },
  {
    "frequency": "Annual"
  },
  {
    "frequency": "Quarterly"
  },
  {
    "frequency": "One-Time"
  }
];