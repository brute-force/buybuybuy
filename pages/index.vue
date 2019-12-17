<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="mt-6">
        <v-autocomplete
          v-model="ticker"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          hide-no-data
          label="Ticker"
          placeholder="Start typing to search"
          prepend-icon="mdi-database-search"
          return-object
          clearable
          class="search"
          @input="go"
        />
        </v-autocomplete>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import debounce from 'debounce';

export default {
  data () {
    return {
      isLoading: false,
      ticker: null,
      items: [],
      search: ''
    };
  },
  watch: {
    // debounce search to avoid hitting api limit
    search (val) {
      if (val) {
        debounce(this.doSearch, 300)(val, this);
      }
    }
  },
  methods: {
    async doSearch (val) {
      try {
        this.isLoading = true;
        const { data: { bestMatches } } = await this.$axios.get(`/query?function=SYMBOL_SEARCH&keywords=${val}&apikey=${process.env.apiKeyAlphaVantage}`);

        this.items = bestMatches.map((item) => {
          return {
            text: item['1. symbol'] + ' - ' + item['2. name'],
            value: item['1. symbol']
          };
        });

        this.isLoading = false;
      } catch (err) {
        this.error(err);
      }
    },
    go ({ text, value }) {
      this.$router.push({ name: 'ticker', params: { ticker: value, company: text.replace(`${value} - `, '') } });
    }
  }
};
</script>

<style scoped>
.search {
  min-width: 300px;
}
</style>
