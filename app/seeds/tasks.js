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
        "Name" : "Fed\\OK Partnership T/R",
        "Number" : "1065",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000"
    },
    {
        "id" : "1b827dc66678362dbf5ce8760c55eb7c48ac6328",
        "Name" : "1099 Prep",
        "Number" : "1099",
        "Frequency" : "Annual",
        "DueDate" : "2016-01-31T06:00:00.000+0000",
        "ExtendedDueDate" : "2016-10-15T05:00:00.000+0000"
    },
    {
        "id" : "1e52bacd00c7a8893ff9b30f23dceb37a3dc082b",
        "Name" : "Fed C Corp T/R",
        "Number" : "1120",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000",
        "ExtendedDueDate" : "2016-09-15T05:00:00.000+0000"
    },
    {
        "id" : "d144b0713a460f1207bc396faa1fc81bb04884a2",
        "Name" : "U.S. S Corp T/R",
        "Number" : "1120S",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T05:00:00.000+0000",
        "ExtendedDueDate" : "2016-09-15T05:00:00.000+0000"
    },
    {
        "id" : "4268029588b94a51f461e4493385a3dec3c684cc",
        "Name" : "941 Quarterly Payroll Report",
        "Number" : "941",
        "Frequency" : "Quarterly EOM",
        "DueDate" : "2016-01-31T06:00:00.000+0000"
    },
    {
        "id" : "87c36f734db6a2e00f7162d5957e0a7ea5db1694",
        "Name" : "Exempt Organization Tax Return",
        "Number" : "990",
        "Frequency" : "Annual",
        "DueDate" : "2016-05-15T19:04:00.000+0000",
        "ExtendedDueDate" : "2016-08-15T19:05:00.000+0000"
    },
    {
        "id" : "347fdbee4350f155ba5e05d5280b7c7b24688816",
        "Name" : "Quarterly FUTA Calculation",
        "Number" : "FUTA-QTRLY",
        "Frequency" : "Quarterly EOM",
        "DueDate" : "2016-07-31T19:07:00.000+0000"
    },
    {
        "id" : "3ce97aa37eaa99400c85a566dbdcf92c5bee71cf",
        "Name" : "Annual 940 FUTA Report",
        "Number" : "FUTA-ANNUAL",
        "Frequency" : "Annual",
        "DueDate" : "2016-01-31T20:09:00.000+0000"
    },
    {
        "id" : "d377cee45c3f8651b03f103b906d9624a30e46eb",
        "Name" : "Monthly Writeup",
        "Number" : "MON-WUP",
        "Frequency" : "Monthly",
        "DueDate" : "2016-01-20T20:09:00.000+0000"
    },
    {
        "id" : "9644c1eed8d333622228cef98a5b28409a2176d5",
        "Name" : "Oklahoma Franchise Tax Report",
        "Number" : "OK-FRAN",
        "Frequency" : "Annual",
        "DueDate" : "2016-09-01T19:11:00.000+0000"
    },
    {
        "id" : "319c5df02788e41511398d4ceaf90a2b86206fe9",
        "Name" : "Oklahoma Sales Tax Semi-Annual",
        "Number" : "OK-Sales-TAX",
        "Frequency" : "Semi-Annual",
        "DueDate" : "2016-01-15T20:16:00.000+0000"
    },
    {
        "id" : "7298faaeaadbd5ea6fa01a56ac60dae0f52bc4e4",
        "Name" : "Oklahoma Sales Tax Monthly",
        "Number" : "OK-Sales-TAX-Mo",
        "Frequency" : "Monthly",
        "DueDate" : "2016-08-15T19:41:00.000+0000"
    },
    {
        "id" : "923405b3b839213de1314cb90e0c93883dd3e227",
        "Name" : "Oklahoma Withholding Monthly",
        "Number" : "OK-ST-WH-Mo",
        "Frequency" : "Monthly",
        "DueDate" : "2016-01-15T20:43:00.000+0000"
    },
    {
        "id" : "6f1b17f351d95b49df7ecd8ae6b44a180d47876b",
        "Name" : "Oklahoma Withholding Quarterly",
        "Number" : "OK-WH-Qtrly",
        "Frequency" : "Quarterly",
        "DueDate" : "2016-01-31T20:44:00.000+0000"
    },
    {
        "id" : "0871486e9464e402e73685b9cd2b4dc2a044cde5",
        "Name" : "Oklahoma Quarterly SUTA Report",
        "Number" : "OK-SUTA",
        "Frequency" : "Quarterly EOM",
        "DueDate" : "2016-01-31T20:45:00.000+0000"
    },
    {
        "id" : "52890366edf05733214db57ec0dd5338131b747c",
        "Name" : "County Property Rendition",
        "Number" : "Co-Prop-Ren",
        "Frequency" : "Annual",
        "DueDate" : "2016-03-15T19:47:00.000+0000"
    },
    {
        "id" : "6a8f7c9cce1219d9b3ef4b1abdb5463af937bbec",
        "Name" : "Payroll 15th of Month",
        "Number" : "PR-Mo",
        "Frequency" : "Monthly",
        "DueDate" : "2016-01-15T20:48:00.000+0000"
    },
    {
        "id" : "c369d57b1934ca1bc39a4f357fa05997f42f1c68",
        "Name" : "Payroll 1st of Month",
        "Number" : "PR-1st-Mo",
        "Frequency" : "Monthly",
        "DueDate" : "2015-01-01T20:50:00.000+0000"
    },
    {
        "id" : "10b0972fcafa7d4a0189a8cb3919786523d8d3e2",
        "Name" : "US 1040",
        "Number" : "US1040",
        "Frequency" : "Annual",
        "DueDate" : "2016-04-15T19:51:00.000+0000",
        "ExtendedDueDate" : "2016-10-15T19:51:00.000+0000"
    }
];
