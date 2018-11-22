var getList = function (request, response) {
  return new Promise(
    function (resolve, reject) {

      var aMessage = [];

      //const memory = request.body.conversation.memory;
      aMessage.push({
        type: 'text',
        content: 'Contact your workshop trainers',
      });

      aMessage.push({
        type: "list",
        content: {
          elements: [
            {
              title: "Leon Beutl",
              imageUrl: "",
              subtitle: "Consultant",
              buttons: [
                {
                  value: "mailto:leon.beutl@capgemini.com",
                  title: "Email",
                  type: "postback"
                }
              ]
            },
            {
              title: "Jörg Rustler",
              imageUrl: "https://media.licdn.com/dms/image/C4E03AQFsSa4H-eTVSw/profile-displayphoto-shrink_200_200/0?e=1548288000&v=beta&t=Roir4vg1Ep-Xksty-r_4L5rM3Temr-jUrTt8M_3GJsk",
              subtitle: "SAP Cloud Platform Development Consultant",
              buttons: [
                {
                  value: "mailto:joerg.rustler@sap.com",
                  title: "Email",
                  type: "postback"
                }
              ]
            }
          ]
        }
      });

      return resolve(aMessage);

    });

}


module.exports = {
  getList
}
