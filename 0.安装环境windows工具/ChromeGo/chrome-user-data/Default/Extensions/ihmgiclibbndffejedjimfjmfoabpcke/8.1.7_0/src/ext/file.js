/**
 * Created by chernikovalexey on 16/05/16.
 */


(function (undefined) {

    pl.extend(ke.ext.file, {
        downloadAsCSV: function (rows_as_array, callback) {
            $.ajax({
                url: "https://api.matetranslate.com/v2/download_csv",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    f: rows_as_array
                }),
                success: function (data) {
                    if (data.file) {
                        console.log(data.file);
                        chrome.runtime.sendMessage({
                            action: ke.processCall('app', 'opt', 'downloadFile'),
                            url: data.file
                        });
                    }

                    callback();
                },
                error: function () {
                    alert('Could not generate the file. Please try again later.');
                    callback();
                }
            });
        }
    });

})();