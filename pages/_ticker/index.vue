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
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price(dateStart)) }}
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
  </v-card>
</template>

<script>
import moment from 'moment-business-days';
import jsonata from 'jsonata';
import { Money } from 'v-money';
import LineChart from '@/components/LineChart';

// set the early month bank holidays
moment.updateLocale('us', {
  holidays: ['01-01', '07-04', '09-02'],
  holidayFormat: 'MM-DD'
});

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
      return `last updated ${this.metaData['3. Last Refreshed']} ${this.metaData['5. Time Zone']}`;
    },
    // calculate current investment value
    investmentValue () {
      const investmentInitial = parseFloat(this.investmentInitial.replace(/\$|,/g, ''));
      return (this.totalReturn() * investmentInitial) + investmentInitial;
    }
  },
  async asyncData ({ params, $axios, error }) {
    try {
      const { data: { 'Meta Data': metaData, 'Time Series (Daily)': data } } = await $axios.get(`/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${params.ticker}&outputsize=full&apikey=${process.env.apiKeyAlphaVantage}`);

      return {
        investmentInitial: '$10,000.00',
        dateStart: '',
        dateEnd: moment(metaData['3. Last Refreshed']).format('YYYY-MM-DD'),
        years: [],
        yearSelected: { year: parseInt(moment().format('YYYY')), isCovered: true },
        metaData,
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
    this.changeYear(moment().year());
  },
  methods: {
    formatDate (date) {
      return moment(date).format('MMM DD, YYYY');
    },
    price (date, isAdjusted) {
      return parseFloat(this.data.filter(el => el.key === date)[0][isAdjusted ? '5. adjusted close' : '4. close']).toFixed(2);
    },
    changeYear (year) {
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
      graphData.forEach((el, i) => {
        if ((moment(curr.key).month() !== moment(el.key).month() && moment(curr.key).year() === moment(el.key).year()) || moment(curr.key).year() !== moment(el.key).year()) {
          if (yearsCovered.length <= 3) {
            labels.unshift(moment(curr.key).format('MM/YYYY'));
            data.unshift(parseFloat(curr['4. close']));
          } else if (moment(curr.key).month() === 0) {
            labels.unshift(moment(curr.key).format('YYYY'));
            data.unshift(parseFloat(curr['4. close']));
          }
        } else if (i === graphData.length - 1) {
          if (yearsCovered.length <= 3) {
            labels.unshift(moment(el.key).format('MM/YYYY'));
            data.unshift(parseFloat(el['4. close']));
          } else {
            labels.unshift(moment(el.key).format('MM/DD/YYYY'));
            data.unshift(parseFloat(el['4. close']));
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
    totalReturn () {
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
<!--
// 20191214012554
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=NVDA&outputsize=full&apikey=9P6EFZ5ST69V2VKD

{
  "Note": "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."
}
-->
