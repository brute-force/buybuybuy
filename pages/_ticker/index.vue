<template>
  <v-card
    class="mt-2 mx-auto"
    max-width="800"
    outlined
  >
    <v-card-title class="py-2">
      <div class="display-2 font-weight-bold text-uppercase my-2">
        {{ $route.params.ticker }}
      </div>
    </v-card-title>
    <v-card-subtitle class="py-2">
      <div class="headline font-weight-regular">
        {{ companyName }}
      </div>
    </v-card-subtitle>
    <line-chart
      v-if="dateStart !== ''"
      :chart-data="chartData"
      :height="200"
    />
    <v-container>
      <v-select
        v-model="yearSelected"
        :items="years"
        item-text="year"
        item-value="year"
        prepend-icon="mdi-calendar"
        class="mt-2"
        @change="changeYear"
      />
      <v-row class="mt-2">
        <v-col
          class="pa-0 ml-2"
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Date Start:
          </div>
        </v-col>
        <v-col
          class="pa-0 ml-2"
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
        >
          <div
            class="date subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ formatDate(dateStart) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Date End:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="date subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ formatDate(dateEnd) }}
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text mx-2 pa-0"
          >
            Price Start:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="price subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price(dateStart, true)) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Price End:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="price subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price(dateEnd)) }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Dividends:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="price subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dividends()) }}
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Total Return:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="price subheading font-weight-light grey--text mx-2 pa-0"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(totalReturn()) }}
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Investment:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="mx-2 pa-0"
          >
            <Money
              v-model="investmentInitial"
              v-bind="money"
              outlined
              class="price subheading font-weight-light grey--text"
              style="width: 100%;"
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="subheading font-weight-regular grey--text ml-2 pa-0"
          >
            Current Value:
          </div>
        </v-col>
        <v-col
          xl="2"
          lg="2"
          md="2"
          sm="4"
          xs="12"
          class="pa-0 ml-2"
        >
          <div
            class="mx-2 pa-0"
          >
            <Money
              v-if="dateStart !== ''"
              :value="investmentValue"
              v-bind="money"
              outlined
              class="price subheading font-weight-light grey--text"
              style="width: 100%;"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="mt-2" />
    <v-icon
      class="pa-3"
      small
    >
      mdi-clock
    </v-icon>
    <span class="caption grey--text font-weight-light">{{ lastUpdated }}</span>
    <v-card-actions>
      <v-spacer />
      <v-btn
        small
        outlined
        to="/"
      >
        <v-icon small class="mr-1">
          mdi-database-search
        </v-icon>
        <span class="font-weight-light">search again</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment';
import jsonata from 'jsonata';
import { Money } from 'v-money';
import { mapGetters } from 'vuex';
import consola from 'consola';
import LineChart from '@/components/LineChart';

export default {
  components: {
    LineChart,
    Money
  },
  directives: {
    money: Money
  },
  computed: {
    lastUpdated () {
      if (this.metaData) {
        return `last updated ${this.metaData['3. Last Refreshed']} ${this.metaData['5. Time Zone']}`;
      } else {
        return this.error({ message: 'API Rate Limit Exceeded. Try again in one minute.' });
      }
    },
    // calculate current investment value
    investmentValue () {
      const investmentInitial = parseFloat(this.investmentInitial.replace(/\$|,/g, ''));
      return (this.totalReturn() * investmentInitial) + investmentInitial;
    },
    ...mapGetters(['companyName'])
  },
  head () {
    return {
      title: `${this.$route.params.ticker} - ${this.companyName}`
    };
  },
  async asyncData ({ params, $axios, error }) {
    try {
      // const { data: { 'Meta Data': metaData, 'Time Series (Daily)': data } } = await $axios.get(`/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${params.ticker}&outputsize=full&apikey=${process.env.apiKeyAlphaVantage}`);
      const res = await $axios.get(`/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${params.ticker}&outputsize=full&apikey=${process.env.apiKeyAlphaVantage}`);

      // handle api rate limit
      if (res.data.Note) {
        return error({ message: 'API Rate Limit Exceeded. Try again in one minute.' });
      } else if (res.data['Error Message']) {
        return error({ message: 'Ticker not found.' });
      }

      const metaData = res.data['Meta Data'];
      const data = res.data['Time Series (Daily)'];

      return {
        investmentInitial: '$10,000.00',
        dateStart: '',
        dateEnd: moment(metaData['3. Last Refreshed']).format('YYYY-MM-DD'),
        years: [],
        yearSelected: { year: parseInt(moment().format('YYYY')), isCovered: true },
        metaData,
        // rearrange api data to array
        data: jsonata('$spread($).{"key": $keys(), "4. close": $.*.\'4. close\', "5. adjusted close": $.*.\'5. adjusted close\', "7. dividend amount": $.*.\'7. dividend amount\'}').evaluate(data),
        chartData: {},
        money: {
          decimal: '.',
          thousands: ',',
          prefix: '$',
          suffix: '',
          precision: 2,
          masked: true
        }
      };
    } catch (err) {
      error(err);
    }
  },
  created () {
    // calculate selected time period data
    this.changeYear(moment().year());
  },
  methods: {
    formatDate (date) {
      return moment(date).format('MMM DD, YYYY');
    },
    changeYear (year) {
      consola.info(`${this.$route.params.ticker} - ${this.companyName} ${year}`);
      this.yearSelected = { year: parseInt(year), isCovered: true };

      let exp = `$.$filter($, function($v, $i, $a) { $contains($v.key, /${year}/)})`;
      const dataYear = jsonata(exp).evaluate(this.data);
      this.dateStart = dataYear[dataYear.length - 1].key;

      // get the years to track
      this.years = [...new Set(jsonata('$.$map($, function ($v) { $substring($v.key, 0, 4) } )').evaluate(this.data))].map((year) => {
        return {
          year: parseInt(year),
          isCovered: year >= parseInt(moment(this.dateStart).format('YYYY'))
        };
      });

      // filter price data by years tracked
      const yearsCovered = this.years.filter(year => year.isCovered).sort((a, b) => a.year - b.year);
      const yearsCoveredRegex = yearsCovered.map(year => year.year).join('|');
      exp = `$.$filter($, function($v, $i, $a) { $contains($v.key, /${yearsCoveredRegex}/)})`;
      const graphData = jsonata(exp).evaluate(this.data);

      const labels = [];
      const data = [];

      let curr = graphData[0];

      // collect graph data (beginning of month by year)
      // label only year for price data > 3 years old
      graphData.forEach((el, i) => {
        if ((moment(curr.key).month() !== moment(el.key).month() && moment(curr.key).year() === moment(el.key).year()) || moment(curr.key).year() !== moment(el.key).year()) {
          if (yearsCovered.length <= 3) {
            labels.unshift(moment(curr.key).format('MM/YYYY'));
            data.unshift(parseFloat(curr['5. adjusted close']));
          } else if (moment(curr.key).month() === 0) {
            labels.unshift(moment(curr.key).format('YYYY'));
            data.unshift(parseFloat(curr['5. adjusted close']));
          }
        } else if (i === graphData.length - 1) {
          if (yearsCovered.length <= 3) {
            labels.unshift(moment(el.key).format('MM/YYYY'));
            data.unshift(parseFloat(el['5. adjusted close']));
          } else {
            // show full date label for earliest price data
            if (this.data[this.data.length - 1] === el) {
              labels.unshift(moment(el.key).format('MM/DD/YYYY'));
            } else {
              labels.unshift(moment(el.key).format('YYYY'));
            }

            data.unshift(parseFloat(el['5. adjusted close']));
          }
        }

        curr = el;
      });

      // add last price data
      const priceLast = parseFloat(graphData[0]['4. close']);

      if (data[data.length - 1] !== priceLast) {
        labels.push(moment(graphData[0].key).format('MM/DD/YYYY'));
        data.push(priceLast);
      }

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Price ($)',
            data
          }
        ]
      };
    },
    price (date, isAdjusted) {
      return parseFloat(this.data.filter(el => el.key === date)[0][isAdjusted ? '5. adjusted close' : '4. close']).toFixed(2);
    },
    totalReturn () {
      // use adjusted close price for starting price
      const priceStart = parseFloat(this.price(this.dateStart, true));
      const priceEnd = parseFloat(this.price(this.dateEnd));

      return (priceEnd - priceStart) / priceStart;
    },
    dividends () {
      const yearsDividend = this.years.filter(year => year.isCovered).map(year => year.year);

      const exp = `$sum($.$filter($, function($v) { $contains($v.key, /${yearsDividend.join('|')}/) }).$map($, function($v) { $number($v.'7. dividend amount') }))`;
      const expression = jsonata(exp);
      const dividends = expression.evaluate(this.data);

      return dividends ? parseFloat(dividends).toFixed(2) : 0;
    }
  }
};
</script>

<style scoped>
.price {
  text-align: right;
}
.date {
  text-align: right;
}
</style>
