//provide your seed function and return the tasks seed when called
module.exports = {
    seed : function(limit,offset,callback){
        callback(null,tasks);
    }
};

//set your task seeds
var tasks =    [
    {
        "id" : "3f5f9925a305933148c13eeed36a255af0e0dc6d",
        "Name" : "Fed OK Partnership T/R",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000"
    },
    {
        "id" : "1b827dc66678362dbf5ce8760c55eb7c48ac6328",
        "Name" : "1099 Prep",
        "Frequency" : "Annual",
        "DueDate" : "2016-01-31T06:00:00.000+0000",
        "ExtendedDueDate" : "2016-10-15T05:00:00.000+0000"
    },
    {
        "id" : "1e52bacd00c7a8893ff9b30f23dceb37a3dc082b",
        "Name" : "Fed C Corp T/R",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000",
        "ExtendedDueDate" : "2016-09-15T05:00:00.000+0000"
    },
    {
        "id" : "d144b0713a460f1207bc396faa1fc81bb04884a2",
        "Name" : "U.S. S Corp T/R",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000",
        "ExtendedDueDate" : "2016-09-15T05:00:00.000+0000"
    },
    {
        "id" : "4268029588b94a51f461e4493385a3dec3c684cc",
        "Name" : "941 Quarterly Payroll Report",
        "Frequency" : "Quarterly EOM",
        "DueDate" : "2016-01-31T06:00:00.000+0000"
    },
    {
        "id" : "87c36f734db6a2e00f7162d5957e0a7ea5db1694",
        "Name" : "Exempt Organization Tax Return",
        "Frequency" : "Annual",
        "DueDate" : "2016-05-15T19:04:00.000+0000",
        "ExtendedDueDate" : "2016-08-15T19:05:00.000+0000"
    },
    {
        "id" : "347fdbee4350f155ba5e05d5280b7c7b24688816",
        "Name" : "Quarterly FUTA Calculation",
        "Frequency" : "Quarterly EOM",
        "DueDate" : "2016-07-31T19:07:00.000+0000"
    },
    {
        "id" : "3ce97aa37eaa99400c85a566dbdcf92c5bee71cf",
        "Name" : "Annual 940 FUTA Report",
        "Frequency" : "Annual",
        "DueDate" : "2016-01-31T20:09:00.000+0000"
    },
    {
        "id" : "10b0972fcafa7d4a0189a8cb3919786523d8d3e2",
        "Name" : "US 1040",
        "Frequency" : "Annual",
        "DueDate" : "2016-04-15T19:51:00.000+0000",
        "ExtendedDueDate" : "2016-10-15T19:51:00.000+0000"
    }
];
