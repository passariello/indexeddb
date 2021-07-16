require('proof')(2, async okay => {
    await require('./harness')(okay, 'idbcursor_continue_index7')
    await harness(async function () {

        var db,
          t = async_test(),
          records = [ { pKey: "primaryKey_0", iKey: "indexKey_0" },
                      { pKey: "primaryKey_1", iKey: "indexKey_1" } ];

        var open_rq = createdb(t);
        open_rq.onupgradeneeded = function (event) {
            db = event.target.result;
            var objStore = db.createObjectStore("store", {keyPath : "pKey"});
            objStore.createIndex("index", "iKey");
            for (var i = 0; i < records.length; i++) {
                objStore.add(records[i]);
            }
            var rq = objStore.index("index").openCursor();
            rq.onsuccess = t.step_func(function(event) {
                var cursor = event.target.result;
                assert_true(cursor instanceof IDBCursor);

                event.target.transaction.abort();
                assert_throws_dom("TransactionInactiveError", function() {
                    cursor.continue();
                }, "Calling continue() should throws an exception TransactionInactiveError when the transaction is not active.");

                t.done();
            });
        }

    })
})
