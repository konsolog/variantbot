const {SlashCommandBuilder, PermissionFlagsBits, TextChannel, EmbedBuilder} = require('discord.js')
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

        const connection = mysql.createConnection(process.env.DATABASE_URL)
        console.log('Connected to DB "Warns"')

        
        const newEmbed = connection.query(
          `SELECT * FROM Warns WHERE user=${user.id};`,
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            
          }
        )
        

        connection.end()
		
        try {
            await interaction.reply({content: "fetching user warns..."})
        } catch (e) {
            console.log(`Could not fetch user ${user}'s warns. ${e}`)
        }
	},
}