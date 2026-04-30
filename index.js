const main = () => {
    window.jsPDF = window.jspdf.jsPDF
    const parameters = new URLSearchParams(window.location.search);
    let params = {};
    const cleanUpData = (key) => {
        if (!params[key]) return [];
        return params[key].split(",").map((ind) => ind.trim());
    };
    for (var value of parameters.keys()) {
        params[value] = parameters.get(value);
    }

    const {
        products,
        quantity,
        unitpriceusd,    // actual unit price
        subtotalusd,     // actual subtotal
        customer,
        location,
        date, companyName, phoneNumber,
        totalLbp, target,
        totalusd, pagewidth, savePdf, potsRemainingLarge, transId,
        potsRemainingMedium, enablePots
    } = params;

    const prodArr = [];
    const productNames = cleanUpData("products");
    const quantities = cleanUpData("quantity");
    const unitPrices = cleanUpData("unitpriceusd");
    const subtotals = cleanUpData("subtotalusd");

    productNames.forEach((name, i) => {
        prodArr.push({
            name: name,
            quantity: quantities[i] || "",
            unitpriceusd: unitPrices[i] || "0",
            subtotalusd: subtotals[i] || "0"
        });
    });

    // Pots section
    const potsRemainingLargePart = document.querySelector("#potsRemainingLarge");
    const potsRemainingMediumPart = document.querySelector("#potsRemainingMedium");
    const totalpricelbpPart = document.querySelector("#totalpricelbp");
    const totalpriceusdPart = document.querySelector("#totalpriceusd");
    const potsSection = document.querySelector("#potsSection");

    if (potsRemainingLargePart) potsRemainingLargePart.innerHTML = (potsRemainingLarge ? potsRemainingLarge : 0) + ' L';
    if (potsRemainingMediumPart) potsRemainingMediumPart.innerHTML = (potsRemainingMedium ? potsRemainingMedium : 0) + ' M';

    if (enablePots === undefined || enablePots === "") {
        if (potsSection) potsSection.remove();
    }

    // Totals
    if (totalpriceusdPart) totalpriceusdPart.innerHTML = totalusd || "0";
    if (totalpricelbpPart) totalpricelbpPart.innerHTML = totalLbp || "0";

    // Company name
    const companyNamePart = document.querySelector("#companyName");
    if (!companyName) {
        if (companyNamePart) companyNamePart.remove();
    } else {
        if (companyNamePart) companyNamePart.innerHTML = companyName + "       INV#" + transId;
    }

    // Phone
    const phoneNumberPart = document.querySelector("#phoneNumber");
    if (!phoneNumber) {
        if (phoneNumberPart) phoneNumberPart.remove();
    } else {
        if (phoneNumberPart) phoneNumberPart.innerHTML = phoneNumber;
    }

    // Customer & location
    const customerPart = document.querySelector("#customer");
    if (customerPart) customerPart.innerHTML = customer + ", " + location;

    // Date
    const datePart = document.querySelector("#date");
    if (datePart) datePart.innerHTML = date;

    // Build table rows
    const tableBody = document.querySelector("#tableBod");
    if (tableBody) {
        tableBody.innerHTML = "";
        prodArr.forEach((product) => {
            tableBody.innerHTML += `
                <tr>
                    <td class="quantity">${product.quantity}</td>
                    <td class="description">${product.name}</td>
                    <td class="price">${product.unitpriceusd}</td>
                    <td class="price">${product.subtotalusd}</td>
                </tr>
            `;
        });
    }

    // Print / PDF
    const ticket = document.querySelector("#ticket");
    if (ticket) {
        ticket.style.maxWidth = pagewidth;
        ticket.style.width = pagewidth;
        var doc = new jsPDF(
            ticket.clientHeight < ticket.clientWidth ? "l" : "p",
            "px",
            [ticket.clientHeight, ticket.clientWidth]
        );
        doc.html(ticket, {
            callback: function (doc) {
                const base64Full = doc.output('datauri');
                if (savePdf) doc.save();
                document.location.href = "rawbt:data:application/pdf;base64," + base64Full.split("base64,")[1];
            }
        });
    }
};
main();
