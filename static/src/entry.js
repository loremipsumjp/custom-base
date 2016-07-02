'use strict';

window._ = require('lodash')
window.Q = require('q')
window.qs = require('qs')
window.Vue = require('vue')
window.axios = require('axios')

window.lib = {
  v1: {
    input: {
      TextInput: require('./lib/v1/input/text').TextInput,
      TextAreaInput: require('./lib/v1/input/text-area').TextAreaInput,
      SelectInput: require('./lib/v1/input/select').SelectInput,
      NumberInput: require('./lib/v1/input/number').NumberInput,
      DateInput: require('./lib/v1/input/date').DateInput,
      FileInput: require('./lib/v1/input/file').FileInput,
      PasswordInput: require('./lib/v1/input/password').PasswordInput,
      JSONInput: require('./lib/v1/input/json').JSONInput,
      DateTimeInput: require('./lib/v1/input/date-time').DateTimeInput,
    },
    page: {
      HomePage: require('./lib/v1/page/home').HomePage,
      IndexPage: require('./lib/v1/page/index').IndexPage,
      DetailPage: require('./lib/v1/page/detail').DetailPage,
      AddPage: require('./lib/v1/page/add').AddPage,
      EditPage: require('./lib/v1/page/edit').EditPage,
      CopyPage: require('./lib/v1/page/copy').CopyPage,
      DeletePage: require('./lib/v1/page/delete').DeletePage,
      PrintPage: require('./lib/v1/page/print').PrintPage,
      ImportPage: require('./lib/v1/page/import').ImportPage,
      ExportPage: require('./lib/v1/page/export').ExportPage,
    },
    validator: {
      NotEmptyValidator: require('./lib/v1/validator/not-empty').NotEmptyValidator,
      RegExpValidator: require('./lib/v1/validator/reg-exp').RegExpValidator,
      ChrisoValidator: require('./lib/v1/validator/chriso-validator').ChrisoValidator,
      FileNotEmptyValidator: require('./lib/v1/validator/file-not-empty').FileNotEmptyValidator,
      PasswordNotEmptyValidator: require('./lib/v1/validator/password-not-empty').PasswordNotEmptyValidator,
    },
    view: {
      TextView: require('./lib/v1/view/text').TextView,
      TextAreaView: require('./lib/v1/view/text-area').TextAreaView,
      LinkView: require('./lib/v1/view/link').LinkView,
      DateView: require('./lib/v1/view/date').DateView,
      TimeView: require('./lib/v1/view/time').TimeView,
      CurrencyView: require('./lib/v1/view/currency').CurrencyView,
      FileView: require('./lib/v1/view/file').FileView,
      JSONView: require('./lib/v1/view/json').JSONView,
      ReduceView: require('./lib/v1/view/reduce').ReduceView,
      ExpressionView: require('./lib/v1/view/expression').ExpressionView,
      ImageView: require('./lib/v1/view/image').ImageView,
      VideoView: require('./lib/v1/view/video').VideoView,
      DateTimeView: require('./lib/v1/view/date-time').DateTimeView,
      DateOnlyView: require('./lib/v1/view/date-only').DateOnlyView,
      PasswordView: require('./lib/v1/view/password').PasswordView,
    },
    util: {
      fetchOne: require('./lib/v1/util/fetch').fetchOne,
      fetchAll: require('./lib/v1/util/fetch').fetchAll,
    },
    format: {
      PreviewFormat: require('./lib/v1/format/preview').PreviewFormat,
    },
    report: {
      TotalReport: require('./lib/v1/report/total').TotalReport,
    },
    aggregator: {
      SumAggregator: require('./lib/v1/aggregator/sum').SumAggregator,
      CountAggregator: require('./lib/v1/aggregator/count').CountAggregator,
      AverageAggregator: require('./lib/v1/aggregator/average').AverageAggregator,
    },
    dashboard: {
      ChartDashboard: require('./lib/v1/dashboard/chart').ChartDashboard,
    },
    chart: {
      GaugeChart: require('./lib/v1/chart/gauge').GaugeChart,
      PieChart: require('./lib/v1/chart/pie').PieChart,
      LineChart: require('./lib/v1/chart/line').LineChart,
      GeoChart: require('./lib/v1/chart/geo').GeoChart,
    },
    widget: {
      HTMLWidget: require('./lib/v1/widget/html').HTMLWidget,
      ChartWidget: require('./lib/v1/widget/chart').ChartWidget,
      ListWidget: require('./lib/v1/widget/list').ListWidget,
    },
    tool: {
      AddColumnTool: require('./lib/v1/tool/add-column').AddColumnTool,
    },
  },
}

window.components = {
  LoginForm: require('./components/login-form').LoginForm,
  LogoutForm: require('./components/logout-form').LogoutForm,

  page: {
    FormPage: require('./components/page/form').FormPage,
    IndexPage: require('./components/page/index').IndexPage,
    DeletePage: require('./components/page/delete').DeletePage,
    AccessKeyGeneratePage: require('./components/page/access-key/generate').AccessKeyGeneratePage,
    FileDeletePage: require('./components/page/file/delete').FileDeletePage,
    ToolDetailPage: require('./components/page/tool/detail').ToolDetailPage,
    ReportDetailPage: require('./components/page/report/detail').ReportDetailPage,
    DashboardDetailPage: require('./components/page/dashboard/detail').DashboardDetailPage,
  },
}

window.models = {
  UserModel: require('./models/user').UserModel,
  AccessKeyModel: require('./models/access-key').AccessKeyModel,
  ProfileModel: require('./models/profile').ProfileModel,
  TableModel: require('./models/table').TableModel,
  ColumnModel: require('./models/column').ColumnModel,
  PageModel: require('./models/page').PageModel,
  FormatModel: require('./models/format').FormatModel,
  ToolModel: require('./models/tool').ToolModel,
  FileModel: require('./models/file').FileModel,
}
