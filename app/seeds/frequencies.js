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
    "id": "Daily",
      "frequency": "Daily"
  },
  {
      "id": "Weekly",
      "frequency": "Weekly"
  },
  {
      "id": "Monthly",
      "frequency": "Monthly"
  },
  {
    "id": "MonthlyEOM",
      "frequency": "Monthly EOM"
  },
  {
    "id": "QuarterlyEOM",
      "frequency": "Quarterly EOM"
  },
  {
    "id": "AnnualEOM",
      "frequency": "Annual EOM"
  },
  {
    "id": "Annual",
      "frequency": "Annual"
  },
  {
    "id": "Quarterly",
      "frequency": "Quarterly"
  },
  {
    "id": "One-Time",
      "frequency": "One-Time"
  },
    {
        "id": "Semi-Annual",
        "frequency": "Semi-Annual"
    }
];
