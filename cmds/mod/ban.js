const {SlashCommandBuilder, PermissionFlagsBits, TextChannel} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban someone')
        .addUserOption(op => 
            op
                .setName("target")
                .setDescription("To be banned")
                .setRequired(true))
        .addStringOption(op => op
                .setName("reason")
                .setDescription("Reason of ban")
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        ,
	async execute(interaction) {
        let reason = interaction.options.getString("reason")
        if (!reason) reason = "No reason provided."

        const member = interaction.options.getUser("target")
        let length = interaction.options.getInteger("length")
        if (!length) length = 1

        console.log(member, member.id)

        member.ban({reason: reason})

        interaction.reply(`User ${member} has been banned for reason: ${reason}`)
	},
}