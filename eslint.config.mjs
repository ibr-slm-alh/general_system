// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
   rules: {
        "@stylistic/member-delimiter-style": [
            "error",
            {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },

                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
            },
        ],
    },
)
