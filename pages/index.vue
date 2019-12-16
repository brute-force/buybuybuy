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
          item-text="1. symbol"
          item-value="2. name"
          hide-no-data
          label="Ticker"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
          clearable
          @input="go"
        />
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

        this.items = bestMatches;
        this.isLoading = false;
      } catch (err) {
        this.error(err);
      }
    },
    go (val) {
      this.$router.push({ path: `/${val['1. symbol']}` });
    }
  }
};
</script>
