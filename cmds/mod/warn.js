const {SlashCommandBuilder, PermissionFlagsBits, TextChannel} = require('discord.js')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://gerald:${process.env.MONGODBPASS}@warningscluster.pr3wnbn.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
    data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a person (Mod Only)')
        .addUserOption(op => 
            op
                .setName("target")
                .setDescription("Person to warn")
                .setRequired(true))
        .addStringOption(op => op
                .setName("reason")
                .setDescription("Reason of warn")
                .setRequired(false)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false)
        ,
	async execute(interaction) {
        const client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });

        let reason = interaction.options.getString('reason')
        if (!reason) reason = "No reason provided."
        let user = interaction.options.getUser('target')
        let strikes = "placeholder"
		
        try {
            await interaction.reply({content: `User ${user} has been warned for: \n\n ${reason}`, ephemeral: false}); 
            await user.send(`❎ You have been warned in VariantCraft for: \n\n ${reason} \n\n You have received **${strikes} out of 4 strikes**. When you get 4 strikes, you will receive a ban. To appeal a ban, please message one of the admins: <@434608451541401610>, <@826748269354680333>, <@573351641248563202>`)
        } catch (e) {
            console.log(`Could not DM user about the warn. ${e}`)
        }

        async function run() {
            try {
              // Connect the client to the server	(optional starting in v4.7)
              await client.connect();
              // Send a ping to confirm a successful connection
              await client.db("admin").command({ ping: 1 });
              console.log("Pinged your deployment. You successfully connected to MongoDB!");
            } finally {
              // Ensures that the client will close when you finish/error
              await client.close();
            }
          }
          run().catch(console.dir);

        /*async function run() {
            try {
              const database = client.db("insertDB");
              const haiku = database.collection("haiku");
              // create a document to insert
              const doc = {
                title: "Record of a Shriveled Datum",
                content: "No bytes, no problem. Just insert a document, in MongoDB",
              }
              const result = await haiku.insertOne(doc);
              console.log(`A document was inserted with the _id: ${result.insertedId}`);
            } finally {
              await client.close();
            }
          }
          run().catch(console.dir);*/
	},
}