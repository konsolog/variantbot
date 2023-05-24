const {SlashCommandBuilder, PermissionFlagsBits, TextChannel} = require('discord.js')
require('dotenv').config()
const mysql = require('mysql2')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('warns')
		.setDescription('Check amount of warns for a person. (Mod Only)')
        .addUserOption(op => 
            op
                .setName("target")
                .setDescription("Warns of person")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false)
        ,
	async execute(interaction) {
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "No reason provided."
        let user = interaction.options.getUser('target')
        let strikes = "placeholder"

        const connection = mysql.createConnection(process.env.DATABASE_URL)
        console.log('Connected to DB "Warns"')

        
        connection.query(
          `SELECT * FROM Warns WHERE user=${user.id};`,
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
          }
        )
        

        connection.end()
		
        try {
            await interaction.reply({content: `<:CHECK:1110605208062525522> User ${user} has been warned for: \n\n${reason}`, ephemeral: false}); 
            await user.send(`<:WARNING:1110606751696433174> You have been warned in VariantCraft for: \n\n${reason} \n\nYou have received **${strikes} out of 4 strikes**. When you get 4 strikes, you will receive a ban. To appeal a ban, please message one of the admins: <@434608451541401610>, <@826748269354680333>, <@573351641248563202>`)
            console.log(`User ${user} has been warned`)
        } catch (e) {
            console.log(`Could not DM user ${user} about the warn but has been warned. ${e}`)
        }
	},
}