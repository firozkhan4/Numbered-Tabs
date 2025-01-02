chrome.tabs.onUpdated.addListener(() => {
    addNumbersOnTabs();
});

chrome.tabs.onRemoved.addListener(()=>{
    addNumbersOnTabs();
})

async function addNumbersOnTabs() {
    try {
        const currentWindow = await chrome.windows.getCurrent({populate: true})

        // const tabs = await chrome.tabs.query({});

        const tabs = currentWindow.tabs;
        tabs.forEach((tab, index) => {

            if(tab.url && (tab.url.startsWith("http") || tab.url.startsWith("https"))){

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (index) => {

                        const marker = `[${index + 1}]`;
                        if (!document.title.startsWith(marker)) {
                            if(document.title.startsWith("[")){
                                const closingBracketIndex = document.title.indexOf("]");
                                if (closingBracketIndex !== -1) {
                                    document.title = document.title.substring(closingBracketIndex + 1).trim();
                                }
                            }
                            document.title = `${marker} ${document.title}`;
                        }
                    },
                    args: [index],
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
}
